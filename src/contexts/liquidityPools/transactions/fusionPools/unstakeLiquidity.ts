import { unstakeInFusion } from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import { FUSION_PROGRAM_PUBKEY } from './constants';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface UnstakeLiquidityTransactionParams {
  router: MainRouterView;
  stakeAccount: StakeAccountView;
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawUnstakeLiquidity, {
  onSuccessMessage: 'Liquidity harvest successfully',
  onErrorMessage: 'Transaction failed',
});

export const unstakeLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
