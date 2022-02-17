import { WSOL } from '@raydium-io/raydium-sdk';

import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import SwapForm from '../../components/SwapForm';
import { Loader } from '../../components/Loader';
import { useLiquidityPools } from '../../contexts/liquidityPools';

const SwapPage = (): JSX.Element => {
  const { loading: poolsDataLoading } = useLiquidityPools();

  const loading = poolsDataLoading;

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
          <SwapForm defaultTokenMint={WSOL.mint} />
        )}
      </div>
    </AppLayout>
  );
};

export default SwapPage;
