import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
// import SystemHealth from './components/SystemHealth';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import { Loader } from '../../components/Loader';
import { useStatsPage } from './useStatsPage';
import styles from './StatsPage.module.scss';
import Lending from './components/Lending';
// import Pools from './components/Pools';

// const poolsInfo = [
//   { name: 'Solpunks', value: '132' },
//   { name: 'Frakt', value: '100' },
//   { name: 'Turtles', value: '132' },
//   { name: 'Other Collecions', value: '400' },
// ];

const StatsPage: FC = () => {
  const { totalStats, lastLoans, lendingPools, dailyStats, loading } =
    useStatsPage();

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Stats</h1>
        <h2 className={styles.subtitle}>Keep track on protocol’s success</h2>
        {loading ? (
          <Loader size="large" />
        ) : (
          <>
            <div className={styles.totalStats}>
              <TotalStats totalStats={totalStats} />
              <DailyActive dailyStats={dailyStats} />
            </div>
            <Lending lendingPools={lendingPools} lastLoans={lastLoans} />
            {/* <div className={styles.poolsWrapper}>
              <Pools poolsInfo={poolsInfo} />
              <SystemHealth health={80} />
            </div> */}
          </>
        )}
      </Container>
    </AppLayout>
  );
};

export default StatsPage;
