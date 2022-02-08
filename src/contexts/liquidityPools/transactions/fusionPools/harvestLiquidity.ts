import { harvestInFusion, Router, Stake } from '@frakters/fusion-pool';
import { PublicKey } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface HarvestLiquidityTransactionParams {
  router: Router;
  stakeAccount: Stake;
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
    wallet.publicKey,
    connection,
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new PublicKey(router.token_mint_input),
    new PublicKey(router.token_mint_output),
    new PublicKey(router.routerPubkey),
    [new PublicKey(stakeAccount.stakePubkey)],
    new PublicKey(router.pool_config_input),
    new PublicKey(router.pool_config_output),
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
