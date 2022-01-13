import CreateLiquidityForm from '../../../components/CreateLiquidityForm';
import { Loader } from '../../../components/Loader';
import SwapForm from '../../../components/SwapForm';

import { useSwapContext } from '../../../contexts/Swap';
import styles from './styles.module.scss';

interface SwapTabProps {
  fractionMint: string;
  vaultMarketAddress?: string;
}

export const SwapTab = ({
  fractionMint,
  vaultMarketAddress,
}: SwapTabProps): JSX.Element => {
  const { poolConfigs, loading: swapLoading } = useSwapContext();

  return swapLoading ? (
    <div className={styles.loading}>
      <Loader size="large" />
    </div>
  ) : (
    <div className={styles.swapTab}>
      {poolConfigs.find(
        ({ baseMint }) => baseMint.toBase58() === fractionMint,
      ) ? (
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
