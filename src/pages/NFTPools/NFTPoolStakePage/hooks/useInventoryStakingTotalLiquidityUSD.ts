import { TokenInfo } from '@solana/spl-token-registry';

import {
  FusionPool,
  useCurrentSolanaPrice,
} from '../../../../contexts/liquidityPools';
import { usePoolTokensPrices } from '../../hooks';

type UsePoolTokenPrice = (poolTokenInfo: TokenInfo) => {
  loading: boolean;
  poolTokenPrice: string;
};

export const usePoolTokenPrice: UsePoolTokenPrice = (poolTokenInfo) => {
  const { pricesByTokenMint: poolTokenPricesByTokenMint, loading } =
    usePoolTokensPrices([poolTokenInfo]);

  return {
    loading,
    poolTokenPrice: poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.buy,
  };
};

type UseInventoryStakingTotalLiquidityUSD = (props: {
  poolTokenInfo: TokenInfo;
  inventoryFusionPool: FusionPool;
}) => {
  loading: boolean;
  totalLiquidity: number;
};

export const useInventoryStakingTotalLiquidityUSD: UseInventoryStakingTotalLiquidityUSD =
  ({ poolTokenInfo, inventoryFusionPool }) => {
    const { poolTokenPrice, loading } = usePoolTokenPrice(poolTokenInfo);
    const { loading: solanaPriceLoading, currentSolanaPriceUSD } =
      useCurrentSolanaPrice();

    const totalLiquidity =
      Number(poolTokenPrice) *
        (Number(inventoryFusionPool?.router?.amountOfStaked) /
          10 ** poolTokenInfo?.decimals) *
        currentSolanaPriceUSD || 0;

    return {
      loading:
        loading || !poolTokenInfo || !inventoryFusionPool || solanaPriceLoading,
      totalLiquidity,
    };
  };
