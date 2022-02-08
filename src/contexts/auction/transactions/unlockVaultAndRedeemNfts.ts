import { unlockVault, redeemNft } from '.';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { VaultState } from '../../fraktion';
import {
  UnlockVaultAndRedeemNftsParams,
  UnlockVaultAndRedeemNftsWrapParams,
  UnlockVaultAndRedeemNftsWrapType,
} from '../auction.model';

export const rowUnlockVaultAndRedeemNfts = async ({
  vaultInfo,
  patchVault,
  wallet,
  connection,
}: UnlockVaultAndRedeemNftsParams): Promise<void> => {
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
    await redeemNft({ vaultInfo, safetyBoxOrder, wallet, connection });

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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowUnlockVaultAndRedeemNfts,
  {
    onErrorMessage: 'Transaction failed',
  },
);

export const unlockVaultAndRedeemNfts =
  ({ wallet, connection, patchVault }: UnlockVaultAndRedeemNftsWrapParams) =>
  (
    params: Omit<
      UnlockVaultAndRedeemNftsParams,
      UnlockVaultAndRedeemNftsWrapType
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      patchVault,
      ...params,
    });
