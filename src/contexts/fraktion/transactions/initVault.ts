import { initBacket as initVaultTransaction } from '@frakters/fraktionalizer-client-library';

import fraktionConfig from '../config';
import {
  wrapTxnWithTryCatch,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { UnfinishedVaultData } from '../fraktion.model';

const { PROGRAM_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS } = fraktionConfig;

export const rawInitVault = async ({
  wallet,
  connection,
}: WalletAndConnection): Promise<UnfinishedVaultData> => {
  const {
    vault: vaultPubkey,
    fractionalMint,
    fractionTreasury,
    redeemTreasury,
  } = await initVaultTransaction({
    connection,
    fractionDecimals: FRACTION_DECIMALS,
    priceMint: SOL_TOKEN_PUBKEY,
    userPubkey: wallet.publicKey.toBase58(),
    vaultProgramId: PROGRAM_PUBKEY,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
  });

  return { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury };
};

export const initVault = wrapTxnWithTryCatch(rawInitVault, {});
