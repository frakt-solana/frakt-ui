import { Dictionary } from 'lodash';

import { NftPoolData } from '../../utils/cacher/nftPools';

export type FetchDataFunc = () => Promise<void>;

export type NftPoolsContextValues = {
  pools: NftPoolData[];
  loading: boolean;
  initialFetch: FetchDataFunc;
  refetch: FetchDataFunc;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
};

export type UseNftPool = (poolPubkey: string) => {
  pool: NftPoolData;
  loading: boolean;
  whitelistedMintsDictionary: Dictionary<boolean>;
  whitelistedCreatorsDictionary: Dictionary<boolean>;
};
