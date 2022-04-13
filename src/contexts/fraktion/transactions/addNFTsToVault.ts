import { addNFTsToBacket as addNFTsToVaultTransaction } from '@frakters/fraktionalizer-client-library';

import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import fraktionConfig from '../config';
import { RawUserTokensByMint, UserNFT } from '../../userTokens';

const { PROGRAM_PUBKEY } = fraktionConfig;

export interface AddNFTsToVault {
  vaultPubkey: string;
  userNfts: UserNFT[];
  rawUserTokensByMint: RawUserTokensByMint;
}

export interface AddNFTsToRawVault
  extends AddNFTsToVault,
    WalletAndConnection {}

export const rawAddNFTsToVault = async ({
  vaultPubkey,
  userNfts,
  wallet,
  connection,
  rawUserTokensByMint,
}: AddNFTsToRawVault): Promise<void> => {
  const nftMintsAndTokenAccounts = userNfts.map(({ mint }) => ({
    mint,
    token_account: String(rawUserTokensByMint[mint]?.tokenAccountPubkey),
  }));

  await addNFTsToVaultTransaction({
    connection,
    nftMintsAndTokenAccounts,
    vaultProgramId: PROGRAM_PUBKEY,
    userPubkey: wallet.publicKey.toString(),
    vaultStrPubkey: vaultPubkey,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawAddNFTsToVault, {
  onSuccessMessage: {
    message: 'NFT(s) added successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const addNFTsToVault = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
