import { Loader } from '../../../components/Loader';
import SwapForm from '../../../components/SwapForm';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import styles from './styles.module.scss';

interface SwapTabProps {
  fractionMint: string;
}

export const SwapTab = ({ fractionMint }: SwapTabProps): JSX.Element => {
  const { poolDataByMint, loading: poolsLoading } = useLiquidityPools();

  return poolsLoading ? (
    <div className={styles.loading}>
      <Loader size="large" />
    </div>
  ) : (
    <div className={styles.swapTab}>
      {poolDataByMint.has(fractionMint) ? (
        <SwapForm defaultTokenMint={fractionMint} />
      ) : (
        <p>{"Looks like this vault doesn't have a liquidity pool yet."}</p>
      )}
    </div>
  );
};
