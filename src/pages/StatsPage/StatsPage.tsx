import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import styles from './StatsPage.module.scss';
import DailyActive from './components/DailyActive';
import Pools from './components/Pools';

const StatsPage: FC = () => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Stats</h1>
        <h2 className={styles.subtitle}>Keep track on protocol’s success</h2>
        <div className={styles.totalStats}>
          {/* <TotalStats
            lockedNftsInPools={287}
            poolsTvl={477.8426}
            poolsVolumeAllTime={1957.4905}
            totalIssuedInLoans={125}
            loansTvl={132.102}
            loansVolumeAllTime={53.9037}
          /> */}
          <DailyActive
            lockedNftsInLoans={1245}
            issuedIn24Hours={526}
            paidBackIn24Hours={131}
            liquidatedIn24Hours={156}
          />
        </div>
        <div>
          <Pools />
        </div>
      </Container>
    </AppLayout>
  );
};

export default StatsPage;
