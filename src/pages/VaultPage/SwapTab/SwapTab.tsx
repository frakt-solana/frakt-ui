import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import CreateLiquidityForm from '../../../components/CreateLiquidityForm';
import { Loader } from '../../../components/Loader';
import SwapForm from '../../../components/SwapForm';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import styles from './styles.module.scss';

interface SwapTabProps {
  fractionMint: string;
  vaultMarketAddress?: string;
  vaultLockedPrice?: BN;
}

export const SwapTab: FC<SwapTabProps> = ({
  fractionMint,
  vaultMarketAddress,
  vaultLockedPrice,
}) => {
  const { poolDataByMint, loading: poolsLoading } = useLiquidityPools();
  const { connected } = useWallet();

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
          {vaultMarketAddress && connected && (
            <CreateLiquidityForm
              vaultLockedPrice={vaultLockedPrice}
              defaultTokenMint={fractionMint}
              marketId={new PublicKey(vaultMarketAddress)}
            />
          )}
        </>
      )}
    </div>
  );
};
