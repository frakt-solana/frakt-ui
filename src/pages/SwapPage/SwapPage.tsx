import { FC } from 'react';
import { raydium } from '@frakt-protocol/frakt-sdk';

import { AppLayout } from '../../components/Layout/AppLayout';
import SwapForm from '../../components/SwapForm';
import { Loader } from '../../components/Loader';
import styles from './styles.module.scss';
import { usePrism } from '../../contexts/prism/prism.hooks';

const SwapPage: FC = () => {
  const { loading } = usePrism();

  return (
    <AppLayout contentClassName={styles.exchange}>
      <div className={styles.container}>
        <h1 className={styles.title}>Swap</h1>
        <h2 className={styles.subtitle}>
          Swap fraktions with your crypto assets
        </h2>
        {loading ? (
          <div className={styles.loader}>
            <Loader size={'large'} />
          </div>
        ) : (
          <SwapForm defaultTokenMint={raydium.WSOL.mint} />
        )}
      </div>
    </AppLayout>
  );
};

export default SwapPage;
