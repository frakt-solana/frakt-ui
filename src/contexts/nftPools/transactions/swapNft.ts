import { PublicKey } from '@solana/web3.js';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../utils/transactions';
import { UserNFT } from './../../userTokens/userTokens.model';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { rawDepositNftToCommunityPool } from './depositNftToCommunityPool';
import { rawGetLotteryTicket } from './getLotteryTicket';

export interface SwapNftParams {
  pool: NftPoolData;
  nft: UserNFT;
  afterDepositNftTransaction?: () => void;
}

export interface SwapNftRawParams extends SwapNftParams, WalletAndConnection {}

const rawSwapNft = async ({
  connection,
  wallet,
  pool,
  nft,
  afterDepositNftTransaction,
}: SwapNftRawParams): Promise<PublicKey> => {
  await rawDepositNftToCommunityPool({
    connection,
    wallet,
    pool,
    nft,
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
