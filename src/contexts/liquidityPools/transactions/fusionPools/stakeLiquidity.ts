import { BN, MainRouterView, pools, web3 } from '@frakt-protocol/frakt-sdk';

import { FUSION_PROGRAM_PUBKEY } from './constants';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface StakeLiquidityTransactionParams {
  router: MainRouterView;
  amount: BN;
}

export interface StakeLiquidityTransactionRawParams
  extends StakeLiquidityTransactionParams,
    WalletAndConnection {}

const rawStakeLiquidity = async ({
  amount,
  router,
  connection,
  wallet,
}: StakeLiquidityTransactionRawParams): Promise<boolean> => {
  const transaction = new web3.Transaction();

  const instruction = await pools.stakeInFusion(
    new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
    connection,
    wallet.publicKey,
    new web3.PublicKey(router.tokenMintInput),
    new web3.PublicKey(router.tokenMintOutput),
    amount,
  );

  transaction.add(instruction);

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawStakeLiquidity, {
  onSuccessMessage: {
    message: 'Liquidity staked successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const stakeLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
