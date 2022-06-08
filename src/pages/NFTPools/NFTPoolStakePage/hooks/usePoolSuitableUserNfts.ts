import { useMemo } from 'react';
import { pools } from '@frakt-protocol/frakt-sdk';

import { UserNFT } from '../../../../state/userTokens/types';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { useUserRawNfts } from '../../hooks';

type UsePoolSuitableUserNfts = (pool: NftPoolData) => {
  nfts: UserNFT[];
  loading: boolean;
};

export const usePoolSuitableUserNfts: UsePoolSuitableUserNfts = (pool) => {
  const { rawNfts, rawNftsLoading } = useUserRawNfts();

  const poolPublicKey = pool?.publicKey?.toBase58();
  const whitelistedMintsDictionary = useMemo(() => {
    if (pool) {
      return pools.getWhitelistedMintsDictionary(pool);
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey]);

  const whitelistedCreatorsDictionary = useMemo(() => {
    if (pool) {
      return pools.getWhitelistedCreatorsDictionary(pool);
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey]);

  const nfts = useMemo(() => {
    return pools.filterWhitelistedNFTs(
      rawNfts || [],
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  return {
    nfts,
    loading: rawNftsLoading,
  };
};
