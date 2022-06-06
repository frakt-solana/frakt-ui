import { useMemo } from 'react';

import {
  filterWhitelistedNFTs,
  getWhitelistedCreatorsDictionary,
  getWhitelistedMintsDictionary,
} from '../../../../contexts/nftPools';
import { UserNFT } from '../../../../contexts/userTokens';
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
      return getWhitelistedMintsDictionary(pool);
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey]);

  const whitelistedCreatorsDictionary = useMemo(() => {
    if (pool) {
      return getWhitelistedCreatorsDictionary(pool);
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey]);

  const nfts = useMemo(() => {
    return filterWhitelistedNFTs(
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
