import { Loader } from '../../../components/Loader';
import SwapForm from '../../../components/SwapForm';

import { useSwapContext } from '../../../contexts/Swap';
import styles from './styles.module.scss';

interface SwapTabProps {
  fractionMint: string;
}

export const SwapTab = ({ fractionMint }: SwapTabProps): JSX.Element => {
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
        <p>{"Looks like this vault doesn't have a liquidity pool"}</p>
      )}
    </div>
  );
};
