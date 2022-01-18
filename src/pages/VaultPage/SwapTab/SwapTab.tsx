import { FC } from 'react';
import CreateLiquidityForm from '../../../components/CreateLiquidityForm';
import { Loader } from '../../../components/Loader';
import SwapForm from '../../../components/SwapForm';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import styles from './styles.module.scss';

interface SwapTabProps {
  fractionMint: string;
  vaultMarketAddress?: string;
}

export const SwapTab: FC<SwapTabProps> = ({
  fractionMint,
  vaultMarketAddress,
}) => {
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
        <>
          <p>{"Looks like this vault doesn't have a liquidity pool"}</p>
          {vaultMarketAddress && (
            <CreateLiquidityForm defaultTokenMint={fractionMint} />
          )}
        </>
      )}
    </div>
  );
};
