import {
  harvestInFusion,
  harvestSecondaryReward,
  unstakeInFusion,
} from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { FUSION_PROGRAM_PUBKEY } from './constants';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import BN from 'bn.js';

export interface UnstakeLiquidityTransactionParams {
  router: MainRouterView;
  secondaryReward: SecondaryRewardView[];
  amount: BN;
  stakeAccount: StakeAccountView;
}

export interface UnstakeLiquidityTransactionRawParams
  extends UnstakeLiquidityTransactionParams,
    WalletAndConnection {}

export const rawUnstakeLiquidity = async ({
  router,
  connection,
  wallet,
  secondaryReward,
  amount,
  stakeAccount,
}: UnstakeLiquidityTransactionRawParams): Promise<boolean | null> => {
  const transaction = new Transaction();

  if (Number(stakeAccount.unstakedAtCumulative)) {
    const harvestInstruction = await harvestInFusion(
      new PublicKey(FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(router.tokenMintInput),
      new PublicKey(router.tokenMintOutput),
    );

    transaction.add(harvestInstruction);
  }

  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  if (secondaryReward.length) {
    const secondaryHarvestInstruction = await harvestSecondaryReward(
      new PublicKey(FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(router.tokenMintInput),
      new PublicKey(router.tokenMintOutput),
      rewardsTokenMint,
    );

    transaction.add(...secondaryHarvestInstruction);
  }

  const unStakeInstruction = await unstakeInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    amount,
  );

  transaction.add(unStakeInstruction);

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawUnstakeLiquidity, {
  onSuccessMessage: {
    message: 'Liquidity harvested successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const unstakeLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
