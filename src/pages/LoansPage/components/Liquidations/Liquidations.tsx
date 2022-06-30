import { FC } from 'react';

import { useLiquidationsPage } from './hooks';
import { LiquidationsTabsNames } from '../../model';
import { Tabs } from '../../../../components/Tabs';
import LiquidationsList from '../LiquidationsList';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';

const Liquidations: FC = () => {
  const { liquidationTabs, tabValue, setTabValue } = useLiquidationsPage();

  return (
    <>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        type="secondary"
      />
      {tabValue === LiquidationsTabsNames.GRACE && (
        <LiquidationsList>
          <GraceCard />
        </LiquidationsList>
      )}
    </>
  );
};

export default Liquidations;
