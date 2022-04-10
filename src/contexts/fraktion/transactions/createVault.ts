import { registerToken } from '../../../utils/registerToken';
import { IS_DEVNET } from '../../../config';
import { rawInitVault, rawAddNFTsToVault, rawFinishVault } from './index';
import { RawUserTokensByMint, UserNFT } from '../../userTokens';
import { UnfinishedVaultData } from '../fraktion.model';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../utils/transactions';

export interface CreateVaultParams {
  userNfts: UserNFT[];
  pricePerFraction: number;
  fractionsAmount: number;
  unfinishedVaultData?: UnfinishedVaultData;
  tokenData: {
    name: string;
    tickerName: string;
    imageUrl: string;
  };
  rawUserTokensByMint: RawUserTokensByMint;
}

export interface CreateVaultRawParams
  extends CreateVaultParams,
    WalletAndConnection {}

export const rawCreateVault = async ({
  userNfts = [],
  pricePerFraction,
  fractionsAmount,
  wallet,
  connection,
  unfinishedVaultData,
  tokenData,
  rawUserTokensByMint,
}: CreateVaultRawParams): Promise<string> => {
  //? If vault doesn't exist then init vault
  const { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury } =
    !unfinishedVaultData
      ? await rawInitVault({ wallet, connection })
      : unfinishedVaultData;

  if (userNfts.length) {
    await rawAddNFTsToVault({
      vaultPubkey,
      userNfts,
      wallet,
      connection,
      rawUserTokensByMint,
    });
  }

  await rawFinishVault({
    unfinishedVaultData: {
      vaultPubkey,
      fractionalMint,
      fractionTreasury,
      redeemTreasury,
    },
    pricePerFraction,
    fractionsAmount,
    wallet,
    connection,
  });

  //? Register token in our registry if it's mainnet
  if (!IS_DEVNET) {
    const { name, tickerName, imageUrl } = tokenData;
    registerToken(tickerName, fractionalMint, imageUrl, name, vaultPubkey);
  }

  return fractionalMint;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawCreateVault, {
  onSuccessMessage: {
    message: 'Fraktionalized successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const createVault = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
