import { TokenInfo } from '@solana/spl-token-registry';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { useNftPool } from '../../../../contexts/nftPools';
import { selectTokenListState } from '../../../../state/tokenList/selectors';
import { NftPoolData } from '../../../../utils/cacher/nftPools';

type UseNftPoolWithTokenInfo = (poolPubkey: string) => {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  loading: boolean;
};

export const useNftPoolWithTokenInfo: UseNftPoolWithTokenInfo = (
  poolPubkey,
) => {
  const { pool, loading: poolLoading } = useNftPool(poolPubkey);

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useSelector(selectTokenListState);

  const poolPublicKey = pool?.publicKey?.toBase58();
  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  return {
    pool,
    poolTokenInfo,
    loading: tokensMapLoading || poolLoading,
  };
};
