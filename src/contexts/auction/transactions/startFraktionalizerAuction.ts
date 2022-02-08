import { WrapperActionTransactionParams } from './../auction.model';
import { PublicKey } from '@solana/web3.js';
import { startFraktionalizerAuction as startFraktionalizerAuctionTransaction } from 'fraktionalizer-client-library';

import { wrapAsyncWithTryCatch } from '../../../utils';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import {
  StartFraktionalizerAuctionParams,
  WrapperActionTransactionType,
} from '../auction.model';

export const rowStartFraktionalizerAuction = async ({
  wallet,
  connection,
  vaultInfo,
  price,
  isAuctionInitialized,
}: StartFraktionalizerAuctionParams): Promise<void> => {
  const supply = vaultInfo.fractionsSupply.toNumber();
  const perShare = Math.round(price / supply);
  const startingAuctionBidCap = perShare * supply;

  await startFraktionalizerAuctionTransaction({
    connection,
    startingAuctionBidPerShare: perShare,
    startingAuctionBidCap: startingAuctionBidCap,
    userPubkey: wallet.publicKey.toString(),
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    vaultAuthority: new PublicKey(vaultInfo.authority),
    vault: vaultInfo.vaultPubkey,
    auction: vaultInfo.auction?.auction?.auctionPubkey || null,
    fractionMint: vaultInfo.fractionMint,
    fractionTreasury: vaultInfo.fractionTreasury,
    redeemTreasury: vaultInfo.redeemTreasury,
    priceMint: vaultInfo.priceMint,
    vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
    sendTxn: async (transaction, signers): Promise<void> => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        walletPublicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
      });
    },
    isAuctionInitialized,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowStartFraktionalizerAuction,
  {
    onSuccessMessage: 'Auction started successfully',
    onErrorMessage: 'Transaction failed',
  },
);

export const startFraktionalizerAuction =
  ({ wallet, connection }: WrapperActionTransactionParams) =>
  (
    params: Omit<
      StartFraktionalizerAuctionParams,
      WrapperActionTransactionType
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
