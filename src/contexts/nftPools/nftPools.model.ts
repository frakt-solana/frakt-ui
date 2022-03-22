import { PublicKey } from '@solana/web3.js';
import { Dictionary } from 'lodash';

import { NftPoolData } from '../../utils/cacher/nftPools';
import {
  DepositNftToCommunityPoolParams,
  GetLotteryTicketParams,
  SwapNftParams,
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
  getLotteryTicket: (params: GetLotteryTicketParams) => Promise<PublicKey>;
  swapNft: (params: SwapNftParams) => Promise<PublicKey>;
};

export type UseNftPool = (poolPubkey: string) => {
  pool: NftPoolData;
  loading: boolean;
  whitelistedMintsDictionary: Dictionary<boolean>;
  whitelistedCreatorsDictionary: Dictionary<boolean>;
};
