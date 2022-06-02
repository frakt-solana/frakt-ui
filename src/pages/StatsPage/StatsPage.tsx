import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import styles from './styles.module.scss';

const StatsPage: FC = () => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Stats</h1>
        <h2 className={styles.subtitle}>
          Borrow and lend money money, liquidate loans
        </h2>
      </Container>
    </AppLayout>
  );
};

export default StatsPage;
