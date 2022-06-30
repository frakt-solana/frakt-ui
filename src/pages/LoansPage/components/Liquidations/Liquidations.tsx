import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useLiquidationsPage } from './hooks';
import { LiquidationsTabsNames } from '../../model';
import { Tabs } from '../../../../components/Tabs';
import LiquidationsList from '../LiquidationsList';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';
import { liquidationsActions } from '../../../../state/liquidations/actions';

const Liquidations: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
  }, [dispatch]);

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