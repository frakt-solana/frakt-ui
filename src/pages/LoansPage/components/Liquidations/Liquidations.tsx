import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

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

const Liquidations: FC = () => {
  const { liquidationTabs, tabValue, setTabValue } = useLiquidationsPage();
  const isRafflesCards = true;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
  }, [dispatch]);

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
