import { unstakeInFusion } from '@frakters/fusion-pool';
import { PublicKey } from '@solana/web3.js';
import { wrapAsyncWithTryCatch } from '../../../../utils';

import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  HarvestLiquidityTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export const rowUnstakeLiquidity = async ({
  router,
  stakeAccount,
  connection,
  walletPublicKey,
  signTransaction,
}: HarvestLiquidityTransactionParams): Promise<void> => {
  await unstakeInFusion(
    walletPublicKey,
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
        walletPublicKey,
        signTransaction,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowUnstakeLiquidity, {
  onSuccessMessage: 'Liquidity harvest successfully',
  onErrorMessage: 'Transaction failed',
});

export const unstakeLiquidity =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<
      HarvestLiquidityTransactionParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
