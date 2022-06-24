import { FC, useEffect } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
// import SystemHealth from './components/SystemHealth';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import { Loader } from '../../components/Loader';
import styles from './StatsPage.module.scss';
import Lending from './components/Lending';
import { useDispatch, useSelector } from 'react-redux';
import { selectStatsState } from '../../state/stats/selectors';
import { statsActions } from '../../state/stats/actions';
// import Pools from './components/Pools';

// const poolsInfo = [
//   { name: 'Solpunks', value: '132' },
//   { name: 'Frakt', value: '100' },
//   { name: 'Turtles', value: '132' },
//   { name: 'Other Collecions', value: '400' },
// ];

const StatsPage: FC = () => {
  const { stats, loading } = useSelector(selectStatsState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!stats) {
      dispatch(statsActions.fetchStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Stats</h1>
        <h2 className={styles.subtitle}>Keep track on protocol’s success</h2>
        {loading ? (
          <Loader size="large" />
        ) : (
          <>
            {stats?.totalStats && (
              <>
                <div className={styles.totalStats}>
                  <TotalStats totalStats={stats?.totalStats} />
                  <DailyActive dailyStats={stats?.dailyActivity} />
                </div>
                <Lending
                  lendingPools={stats?.lendingPools}
                  lastLoans={stats?.lastLoans}
                />
                {/* <div className={styles.poolsWrapper}>
              <Pools poolsInfo={poolsInfo} />
              <SystemHealth health={80} />
            </div> */}
              </>
            )}
          </>
        )}
      </Container>
    </AppLayout>
  );
};

export default StatsPage;
