export default {};

// import {} from 'fraktionalizer-client-library';

// import {
//   createTransactionFuncFromRaw,
//   signAndConfirmTransaction,
//   WalletAndConnection,
// } from '../../../utils/transactions';
// import { wrapAsyncWithTryCatch } from '../../../utils';
// import fraktionConfig from '../../fraktion/config';
// import { VaultData } from '../../fraktion';

// interface CreateBuyoutByOwnerParams {
//   vaultInfo: VaultData;
//   price: number;
// }

// interface CreateBuyoutByOwnerRawParams
//   extends CreateBuyoutByOwnerParams,
//     WalletAndConnection {}

// export const rawCreateBuyoutByOwner = async ({
//   wallet,
//   connection,
//   vaultInfo,
//   price,
// }: CreateBuyoutByOwnerRawParams): Promise<void> => {
//   const supply = vaultInfo.fractionsSupply.toNumber();
//   const perShare = Math.ceil((price * 1e9) / supply);
//   const bidCap = perShare * supply;

//   await createBuyoutByOwnerTx({
//     connection,
//     winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
//     bidPerShare: perShare,
//     bidCap,
//     adminPubkey: fraktionConfig.ADMIN_PUBKEY,
//     userPubkey: wallet.publicKey,
//     vault: vaultInfo.vaultPubkey,
//     auction: vaultInfo.auction.auction.auctionPubkey,
//     fractionMint: vaultInfo.fractionMint,
//     fractionTreasury: vaultInfo.fractionTreasury,
//     redeemTreasury: vaultInfo.redeemTreasury,
//     priceMint: vaultInfo.priceMint,
//     vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
//     sendTxn: async (transaction, signers) => {
//       await signAndConfirmTransaction({
//         transaction,
//         signers,
//         connection,
//         wallet,
//       });
//     },
//   });
// };

// const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawCreateBuyoutByOwner, {
//   onSuccessMessage: {
//     message: 'Buyout made successfully',
//   },
//   onErrorMessage: { message: 'Transaction failed' },
// });

// export const bidOnAuction = createTransactionFuncFromRaw(
//   wrappedAsyncWithTryCatch,
// );
