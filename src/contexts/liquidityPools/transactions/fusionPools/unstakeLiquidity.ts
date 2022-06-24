import {
  BN,
  MainRouterView,
  SecondaryRewardView,
  StakeAccountView,
  pools,
  AnchorProvider,
  web3,
} from '@frakt-protocol/frakt-sdk';

import { FUSION_PROGRAM_PUBKEY } from './constants';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

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
  const transaction = new web3.Transaction();

  if (Number(stakeAccount.unstakedAtCumulative)) {
    const harvestInstruction = await pools.harvestInFusion(
      new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
      new AnchorProvider(connection, wallet, null),
      wallet.publicKey,
      new web3.PublicKey(router.tokenMintInput),
      new web3.PublicKey(router.tokenMintOutput),
    );

    transaction.add(harvestInstruction);
  }

  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new web3.PublicKey(tokenMint),
  );

  if (secondaryReward.length) {
    const secondaryHarvestInstruction = await pools.harvestSecondaryReward(
      new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
      new AnchorProvider(connection, wallet, null),
      wallet.publicKey,
      new web3.PublicKey(router.tokenMintInput),
      new web3.PublicKey(router.tokenMintOutput),
      rewardsTokenMint,
    );

    transaction.add(...secondaryHarvestInstruction);
  }

  const unStakeInstruction = await pools.unstakeInFusion(
    new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
    new AnchorProvider(connection, wallet, null),
    wallet.publicKey,
    new web3.PublicKey(router.tokenMintInput),
    new web3.PublicKey(router.tokenMintOutput),
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
