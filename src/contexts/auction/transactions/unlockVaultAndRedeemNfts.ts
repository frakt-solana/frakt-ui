import { unlockVault } from './index';
import { VaultData, VaultState } from '../../fraktion';
import {
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { rawRedeemNft } from './redeemNft';

interface UnlockVaultAndRedeemNftsParams {
  vaultInfo: VaultData;
}

interface UnlockVaultAndRedeemNftsRawParams
  extends WalletAndConnection,
    UnlockVaultAndRedeemNftsParams {
  patchVault: (vaultInfo: VaultData) => void;
}

export const rawUnlockVaultAndRedeemNfts = async ({
  vaultInfo,
  patchVault,
  wallet,
  connection,
}: UnlockVaultAndRedeemNftsRawParams): Promise<void> => {
  const isVaultLocked =
    vaultInfo.realState !== VaultState.AuctionFinished &&
    vaultInfo.realState !== VaultState.Inactive;

  const isVaultInactive = vaultInfo.realState === VaultState.Inactive;

  //? Unlock vault if it's locked
  if (isVaultLocked) {
    await unlockVault({ vaultInfo, wallet, connection });
    patchVault({
      ...vaultInfo,
      realState: VaultState.AuctionFinished,
      state: VaultState.AuctionFinished,
    });
  }

  for (
    let safetyBoxOrder = vaultInfo.tokenTypeCount - 1;
    safetyBoxOrder > -1;
    --safetyBoxOrder
  ) {
    await rawRedeemNft({ vaultInfo, safetyBoxOrder, wallet, connection });

    //? Need to set state every time because function fired and vaultData is contant in it's closure
    //? Don't change state if vault was inactive
    patchVault({
      ...vaultInfo,
      tokenTypeCount: safetyBoxOrder,
      realState: isVaultInactive
        ? vaultInfo.realState
        : VaultState.AuctionFinished,
      state: isVaultInactive ? vaultInfo.realState : VaultState.AuctionFinished,
    });
  }
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(
  rawUnlockVaultAndRedeemNfts,
  {
    onErrorMessage: { message: 'Transaction failed' },
  },
);

//? Can't use createTransactionFuncFromRaw in thit case
export const unlockVaultAndRedeemNfts =
  ({
    wallet,
    connection,
    patchVault,
  }: Omit<
    UnlockVaultAndRedeemNftsRawParams,
    keyof UnlockVaultAndRedeemNftsParams
  >) =>
  (params: UnlockVaultAndRedeemNftsParams): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      patchVault,
      ...params,
    });
