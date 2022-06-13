import { Provider } from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { pools, MainRouterView } from '@frakt-protocol/frakt-sdk';

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
  const transaction = new Transaction();

  const instruction = await pools.stakeInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
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
