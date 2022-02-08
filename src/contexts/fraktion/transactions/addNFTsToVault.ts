import { addNFTsToBacket as addNFTsToVaultTransaction } from 'fraktionalizer-client-library';

import { AddNFTsToVault, WrappedTranscationType } from '../fraktion.model';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../config';

const { PROGRAM_PUBKEY } = fraktionConfig;

export const rowAddNFTsToVault = async ({
  vaultPubkey,
  userNfts,
  walletPublicKey,
  signTransaction,
  connection,
  rawUserTokensByMint,
}: AddNFTsToVault): Promise<void> => {
  const nftMintsAndTokenAccounts = userNfts.map(({ mint }) => ({
    mintAddress: mint,
    tokenAccount: String(rawUserTokensByMint[mint]?.tokenAccountPubkey),
  }));

  await addNFTsToVaultTransaction({
    connection,
    nftMintsAndTokenAccounts,
    vaultProgramId: PROGRAM_PUBKEY,
    userPubkey: walletPublicKey.toString(),
    vaultStrPubkey: vaultPubkey,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        walletPublicKey: walletPublicKey,
        signTransaction: signTransaction,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowAddNFTsToVault, {});

export const addNFTsToVault =
  ({ walletPublicKey, signTransaction, connection }: AddNFTsToVault) =>
  (params: Omit<AddNFTsToVault, WrappedTranscationType>): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
