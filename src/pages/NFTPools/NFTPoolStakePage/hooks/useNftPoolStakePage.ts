import { raydium } from '@frakt-protocol/frakt-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import {
  FusionPool,
  RaydiumPoolInfo,
} from '../../../../contexts/liquidityPools';
import { UserNFT } from '../../../../state/userTokens/types';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { useAPR } from '../../hooks';
import { useNftPoolLiquidityAndFusionWithPolling } from './useNftPoolLiquidityAndFusionWithPolling';
import { useNftPoolWithTokenInfo } from './useNftPoolWithTokenInfo';
import { usePoolSuitableUserNfts } from './usePoolSuitableUserNfts';

type UseNftPoolForStakePage = (poolPubkey: string) => {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  userNfts: UserNFT[];
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  inventoryFusionPool: FusionPool;
  liquidityFusionPool: FusionPool;
  pageLoading: boolean;
  contentLoading: boolean;
};

export const useNftPoolStakePage: UseNftPoolForStakePage = (poolPubkey) => {
  const {
    pool,
    poolTokenInfo,
    loading: poolLoading,
  } = useNftPoolWithTokenInfo(poolPubkey);

  const { nfts: userNfts, loading: userNftsLoading } =
    usePoolSuitableUserNfts(pool);

  const { loading: aprLoading } = useAPR();

  const {
    raydiumLiquidityPoolKeys,
    raydiumPoolInfo,
    inventoryFusionPool,
    liquidityFusionPool,
    loading: liquidityAndFusionPoolsLoading,
  } = useNftPoolLiquidityAndFusionWithPolling(poolTokenInfo?.address);

  const pageLoading = poolLoading || aprLoading;

  const contentLoading =
    pageLoading || userNftsLoading || liquidityAndFusionPoolsLoading;

  return {
    pool,
    poolTokenInfo,
    userNfts,
    raydiumLiquidityPoolKeys,
    raydiumPoolInfo,
    inventoryFusionPool,
    liquidityFusionPool,
    pageLoading,
    contentLoading,
  };
};
