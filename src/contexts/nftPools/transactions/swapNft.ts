import { PublicKey } from '@solana/web3.js';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../utils/transactions';

import { wrapAsyncWithTryCatch } from '../../../utils';
import { rawDepositNftToCommunityPool } from './depositNftToCommunityPool';
import { rawGetLotteryTicket } from './getLotteryTicket';

export interface SwapNftParams {
  pool: NftPoolData;
  nftMint: PublicKey;
  byCreator?: boolean;
  afterDepositNftTransaction?: () => void;
}

export interface SwapNftRawParams extends SwapNftParams, WalletAndConnection {}

const rawSwapNft = async ({
  connection,
  wallet,
  pool,
  nftMint,
  byCreator,
  afterDepositNftTransaction,
}: SwapNftRawParams): Promise<PublicKey> => {
  await rawDepositNftToCommunityPool({
    connection,
    wallet,
    pool,
    nftMint,
    byCreator,
    afterTransaction: afterDepositNftTransaction,
  });

  const lotteryTicketPubkey = await rawGetLotteryTicket({
    connection,
    wallet,
    pool,
  });

  return lotteryTicketPubkey;
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawSwapNft, {
  onErrorMessage: 'NFT swap failed',
});

export const swapNft = createTransactionFuncFromRaw(wrappedAsyncWithTryCatch);
