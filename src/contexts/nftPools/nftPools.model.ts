import { Dictionary } from 'lodash';
import { web3 } from '@frakt-protocol/frakt-sdk';

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
  ) => Promise<boolean | null>;
  getLotteryTicket: (params: GetLotteryTicketParams) => Promise<web3.PublicKey>;
};

export type UseNftPool = (poolPubkey: string) => {
  pool: NftPoolData;
  loading: boolean;
  whitelistedMintsDictionary: Dictionary<boolean>;
  whitelistedCreatorsDictionary: Dictionary<boolean>;
};
