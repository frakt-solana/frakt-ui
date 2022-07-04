import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { liquidationsActions } from '../../../../state/liquidations/actions';
import { useLiquidationsPage } from '.';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { LiquidationsTabsNames } from '../../model';
import { Tabs } from '../../../../components/Tabs';
import NoWinningRaffles from '../NoWinningRaffles';
import LiquidationsList from '../LiquidationsList';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';
import WonRaffleCard from '../WonRaffleCard';
import {
  selectSocket,
  selectWalletPublicKey,
} from '../../../../state/common/selectors';

const Liquidations: FC = () => {
  const { liquidationTabs, tabValue, setTabValue } = useLiquidationsPage();
  const isRafflesCards = true;

  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);

  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
    dispatch(liquidationsActions.fetchRaffleList());
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit('lottery-tickets-subscribe');
    }
  }, [socket]);

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('won-raffles-subscribe', { wallet: publicKey, limit: 20 });
    }
  }, [socket, publicKey]);

  return (
    <>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        type="secondary"
      />
      {tabValue === LiquidationsTabsNames.LIQUIDATIONS && (
        <LiquidationsList withRafflesInfo>
          <LiquidationRaffleCard />
        </LiquidationsList>
      )}
      {tabValue === LiquidationsTabsNames.GRACE && (
        <LiquidationsList>
          <GraceCard />
        </LiquidationsList>
      )}
      {tabValue === LiquidationsTabsNames.RAFFLES &&
        (isRafflesCards ? (
          <LiquidationsList>
            <WonRaffleCard />
          </LiquidationsList>
        ) : (
          <NoWinningRaffles />
        ))}
    </>
  );
};

export default Liquidations;
