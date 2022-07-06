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
import {
  selectGraceList,
  selectRaffleList,
  selectWonRaffleList,
} from '../../../../state/liquidations/selectors';

const Liquidations: FC = () => {
  const { liquidationTabs, tabValue, setTabValue } = useLiquidationsPage();

  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);
  const graceList = useSelector(selectGraceList);
  const raffleList = useSelector(selectRaffleList);
  const wonRaffleList = useSelector(selectWonRaffleList);

  console.log(graceList);

  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
    dispatch(liquidationsActions.fetchRaffleList());
  }, [dispatch]);

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('won-raffles-subscribe', { wallet: publicKey, limit: 20 });
      socket.emit('lottery-tickets-subscribe', publicKey);
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
          {raffleList.map((item) => (
            <LiquidationRaffleCard key={item.nftMint} data={item} />
          ))}
        </LiquidationsList>
      )}
      {tabValue === LiquidationsTabsNames.GRACE && (
        <LiquidationsList>
          {graceList.map((item) => (
            <GraceCard key={item.nftMint} data={item} />
          ))}
        </LiquidationsList>
      )}
      {tabValue === LiquidationsTabsNames.RAFFLES &&
        (wonRaffleList.length ? (
          <LiquidationsList>
            {wonRaffleList.map((item) => (
              <WonRaffleCard key={item.nftMint} data={item} />
            ))}
          </LiquidationsList>
        ) : (
          <NoWinningRaffles />
        ))}
    </>
  );
};

export default Liquidations;
