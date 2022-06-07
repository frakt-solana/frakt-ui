import { FC } from 'react';

import { LiquidationsTabsNames, useLiquidationsPage } from '.';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { Tabs } from '../../../../components/Tabs';
import LiquidationsList from '../LiquidationsList';
import NoWinningRaffles from '../NoWinningRaffles';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';
import WonRaffleCard from '../WonRaffleCard';

const Liquidations: FC = () => {
  const { liquidationTabs, tabValue, setTabValue } = useLiquidationsPage();

  return (
    <div>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        type="secondary"
      />
      <LiquidationsList
        withRafflesInfo={tabValue === LiquidationsTabsNames.LIQUIDATIONS}
      >
        {tabValue === LiquidationsTabsNames.LIQUIDATIONS && (
          <LiquidationRaffleCard />
        )}
        {tabValue === LiquidationsTabsNames.GRACE && <GraceCard />}
        {tabValue === LiquidationsTabsNames.RAFFLES && <WonRaffleCard />}
      </LiquidationsList>
    </div>
  );
};

export default Liquidations;
