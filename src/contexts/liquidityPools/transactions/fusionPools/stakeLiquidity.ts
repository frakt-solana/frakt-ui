import { Router, stakeInFusion } from '@frakters/fusion-pool';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { wrapAsyncWithTryCatch } from '../../../../utils';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface StakeLiquidityTransactionParams {
  router: Router;
  amount: BN;
}

export interface StakeLiquidityTransactionRawParams
  extends StakeLiquidityTransactionParams,
    WalletAndConnection {}

export const rawStakeLiquidity = async ({
  amount,
  router,
  connection,
  wallet,
}: StakeLiquidityTransactionRawParams): Promise<void> => {
  await stakeInFusion(
    wallet.publicKey,
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
        wallet,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawStakeLiquidity, {});

export const stakeLiquidity =
  ({ connection, wallet }: WalletAndConnection) =>
  (params: StakeLiquidityTransactionParams): Promise<void> =>
    wrappedAsyncWithTryCatch({
      wallet,
      connection,
      ...params,
    });
