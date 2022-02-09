import { harvestInFusion } from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface HarvestLiquidityTransactionParams {
  router: MainRouterView;
  stakeAccount: StakeAccountView;
}

export interface HarvestLiquidityTransactionRawParams
  extends HarvestLiquidityTransactionParams,
    WalletAndConnection {}

export const rowHarvestLiquidity = async ({
  router,
  stakeAccount,
  connection,
  wallet,
}: HarvestLiquidityTransactionRawParams): Promise<void> => {
  await harvestInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    new PublicKey(stakeAccount.stakeAccountPubkey),
    async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowHarvestLiquidity, {
  onSuccessMessage: 'Liquidity harvested successfully',
  onErrorMessage: 'Transaction failed',
});

export const harvestLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
