import BN from 'bn.js';
import { finishBacket as finishVaultTransaction } from '@frakters/fraktionalizer-client-library';

import { UnfinishedVaultData } from '../fraktion.model';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { adjustPricePerFraction } from '../utils';
import fraktionConfig from '../config';

const { ADMIN_PUBKEY, PROGRAM_PUBKEY } = fraktionConfig;

export interface FinishVaultParams {
  unfinishedVaultData: UnfinishedVaultData;
  pricePerFraction: number;
  fractionsAmount: number;
}

export interface FinishVaultRawParams
  extends FinishVaultParams,
    WalletAndConnection {}

export const rawFinishVault = async ({
  unfinishedVaultData,
  pricePerFraction,
  fractionsAmount,
  wallet,
  connection,
}: FinishVaultRawParams): Promise<void> => {
  const { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury } =
    unfinishedVaultData;

  const fractionsAmountBn = new BN(fractionsAmount * 1e3);

  const pricePerFractionBn = adjustPricePerFraction(
    new BN(pricePerFraction * 1e6),
    fractionsAmountBn,
  );

  await finishVaultTransaction({
    connection,
    pricePerShare: pricePerFractionBn,
    numberOfShares: fractionsAmountBn,
    adminPubkey: ADMIN_PUBKEY,
    userPubkey: wallet.publicKey.toBase58(),
    vault: vaultPubkey,
    fractionalMint: fractionalMint,
    fractionTreasury: fractionTreasury,
    redeemTreasury: redeemTreasury,
    vaultProgramId: PROGRAM_PUBKEY,
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawFinishVault, {});

export const finishVault = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
