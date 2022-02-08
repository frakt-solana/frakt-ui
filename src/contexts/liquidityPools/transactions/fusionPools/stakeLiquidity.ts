import { stakeInFusion } from '@frakters/fusion-pool';
import { PublicKey } from '@solana/web3.js';
import { wrapAsyncWithTryCatch } from '../../../../utils';

import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  StakeLiquidityTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export const rowStakeLiquidity = async ({
  amount,
  router,
  connection,
  walletPublicKey,
  signTransaction,
}: StakeLiquidityTransactionParams): Promise<void> => {
  await stakeInFusion(
    walletPublicKey,
    connection,
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new PublicKey(router.token_mint_input),
    new PublicKey(router.token_mint_output),
    amount,
    new PublicKey(router.routerPubkey),
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowStakeLiquidity, {});

export const stakeLiquidity =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<
      StakeLiquidityTransactionParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      signTransaction,
      connection,
      walletPublicKey,
      ...params,
    });
