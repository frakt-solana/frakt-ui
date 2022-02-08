import { initBacket as initVaultTransaction } from 'fraktionalizer-client-library';

import fraktionConfig from '../config';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import {
  UnfinishedVaultData,
  WrapperTransactionParams,
} from '../fraktion.model';

const { PROGRAM_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS } = fraktionConfig;

export const rowInitVault = async ({
  walletPublicKey,
  signTransaction,
  connection,
}: WrapperTransactionParams): Promise<UnfinishedVaultData> => {
  const {
    vault: vaultPubkey,
    fractionalMint,
    fractionTreasury,
    redeemTreasury,
  } = await initVaultTransaction({
    connection,
    fractionDecimals: FRACTION_DECIMALS,
    priceMint: SOL_TOKEN_PUBKEY,
    userPubkey: walletPublicKey.toBase58(),
    vaultProgramId: PROGRAM_PUBKEY,
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

  return { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury };
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowInitVault, {});

export const initVault = ({
  connection,
  walletPublicKey,
  signTransaction,
}: WrapperTransactionParams): Promise<UnfinishedVaultData> =>
  wrappedAsyncWithTryCatch({
    signTransaction,
    connection,
    walletPublicKey,
  });
