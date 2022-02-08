import BN from 'bn.js';
import { finishBacket as finishVaultTransaction } from 'fraktionalizer-client-library';

import { FinishVaultParams, WrappedTranscationType } from '../fraktion.model';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { adjustPricePerFraction } from '../utils';
import fraktionConfig from '../config';

const { ADMIN_PUBKEY, PROGRAM_PUBKEY } = fraktionConfig;

export const rowFinishVault = async ({
  unfinishedVaultData,
  pricePerFraction,
  fractionsAmount,
  walletPublicKey,
  signTransaction,
  connection,
}: FinishVaultParams): Promise<void> => {
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
    userPubkey: walletPublicKey.toString(),
    vault: vaultPubkey,
    fractionalMint: fractionalMint,
    fractionTreasury: fractionTreasury,
    redeemTreasury: redeemTreasury,
    vaultProgramId: PROGRAM_PUBKEY,
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        walletPublicKey: walletPublicKey,
        signTransaction: signTransaction,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowFinishVault, {});

export const finishVault =
  ({ walletPublicKey, signTransaction, connection }: FinishVaultParams) =>
  (params: Omit<FinishVaultParams, WrappedTranscationType>): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
