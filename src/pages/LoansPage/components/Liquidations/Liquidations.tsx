import React from 'react';
import { Tab, Tabs, useTabs } from '../../../../components/Tabs';
import styles from './Liquidations.module.scss';

const Liquidations = () => {
  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LIQUIDATIONS_TABS,
    defaultValue: LIQUIDATIONS_TABS[0].value,
  });

  return (
    <div>
      <Tabs
        className={styles.tab}
        tabs={loanTabs}
        value={tabValue}
        setValue={setTabValue}
      />
    </div>
  );
};

export default Liquidations;

const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Liquidations raffle',
    value: 'liquidations',
  },
  {
    label: 'Grace List',
    value: 'grace',
    disabled: true,
  },
  {
    label: 'Won raffles',
    value: 'raffles',
  },
];
