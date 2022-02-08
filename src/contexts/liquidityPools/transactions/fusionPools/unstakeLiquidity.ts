import { Router, Stake, unstakeInFusion } from '@frakters/fusion-pool';
import { PublicKey } from '@solana/web3.js';
import { wrapAsyncWithTryCatch } from '../../../../utils';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface UnstakeLiquidityTransactionParams {
  router: Router;
  stakeAccount: Stake;
}

export interface UnstakeLiquidityTransactionRawParams
  extends UnstakeLiquidityTransactionParams,
    WalletAndConnection {}

export const rawUnstakeLiquidity = async ({
  router,
  stakeAccount,
  connection,
  wallet,
}: UnstakeLiquidityTransactionRawParams): Promise<void> => {
  await unstakeInFusion(
    wallet.publicKey,
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawUnstakeLiquidity, {
  onSuccessMessage: 'Liquidity harvest successfully',
  onErrorMessage: 'Transaction failed',
});

export const unstakeLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
