import { createBuyoutByOwner as createBuyoutByOwnerTx } from '@frakters/fraktionalizer-client-library';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import { VaultData } from '../../fraktion';

interface CreateBuyoutByOwnerParams {
  vaultInfo: VaultData;
}

interface CreateBuyoutByOwnerRawParams
  extends CreateBuyoutByOwnerParams,
    WalletAndConnection {}

export const rawCreateBuyoutByOwner = async ({
  wallet,
  connection,
  vaultInfo,
}: CreateBuyoutByOwnerRawParams): Promise<void> => {
  await createBuyoutByOwnerTx(
    connection,
    vaultInfo.vaultPubkey,
    wallet.publicKey.toBase58(),
    vaultInfo.fractionMint,
    vaultInfo.fractionTreasury,
    vaultInfo.authority,
    fraktionConfig.PROGRAM_PUBKEY,
    async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawCreateBuyoutByOwner, {
  onSuccessMessage: {
    message: 'Buyout made successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const createBuyoutByOwner = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
