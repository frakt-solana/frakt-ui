import { PublicKey } from '@solana/web3.js';
import { Dictionary } from 'lodash';

import { NftPoolData } from '../../utils/cacher/nftPools';
import {
  DepositNftToCommunityPoolParams,
  GetLotteryTicketParams,
} from './transactions';

export type FetchDataFunc = () => Promise<void>;

export type NftPoolsContextValues = {
  pools: NftPoolData[];
  loading: boolean;
  initialFetch: FetchDataFunc;
  refetch: FetchDataFunc;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  depositNftToCommunityPool: (
    params: DepositNftToCommunityPoolParams,
  ) => Promise<void>;
  getLotteryTicket: (params: GetLotteryTicketParams) => Promise<PublicKey>;
};

export type UseNftPool = (poolPubkey: string) => {
  pool: NftPoolData;
  loading: boolean;
  whitelistedMintsDictionary: Dictionary<boolean>;
  whitelistedCreatorsDictionary: Dictionary<boolean>;
};
