import {
  CreateVaultParams,
  WrappedTranscationType,
  WrapperTransactionParams,
} from '../fraktion.model';
import { registerToken } from '../../../utils/registerToken';
import { IS_DEVNET } from '../../../config';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { initVault, addNFTsToVault, finishVault } from './index';

export const rowCreateVault = async ({
  userNfts = [],
  pricePerFraction,
  fractionsAmount,
  walletPublicKey,
  signTransaction,
  connection,
  unfinishedVaultData,
  tokenData,
  rawUserTokensByMint,
}: CreateVaultParams): Promise<string | null> => {
  //? If vault doesn't exist then init vault
  const { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury } =
    !unfinishedVaultData
      ? await initVault({ walletPublicKey, signTransaction, connection })
      : unfinishedVaultData;

  if (userNfts.length) {
    await addNFTsToVault({
      vaultPubkey,
      userNfts,
      walletPublicKey,
      signTransaction,
      connection,
      rawUserTokensByMint,
    });
  }

  await finishVault({
    unfinishedVaultData: {
      vaultPubkey,
      fractionalMint,
      fractionTreasury,
      redeemTreasury,
    },
    pricePerFraction,
    fractionsAmount,
    walletPublicKey,
    signTransaction,
    connection,
  });

  //? Register token in our registry if it's mainnet
  if (!IS_DEVNET) {
    const { name, tickerName, imageUrl } = tokenData;
    registerToken(tickerName, fractionalMint, imageUrl, name, vaultPubkey);
  }

  return fractionalMint;
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowCreateVault, {
  onSuccessMessage: 'Fraktionalized successfully',
  onErrorMessage: 'Transaction failed',
});

export const createVault =
  ({
    walletPublicKey,
    signTransaction,
    connection,
  }: WrapperTransactionParams) =>
  (
    params: Omit<CreateVaultParams, WrappedTranscationType>,
  ): Promise<string | null> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
