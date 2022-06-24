import {
  MainRouterView,
  SecondaryRewardView,
  pools,
  AnchorProvider,
  web3,
} from '@frakt-protocol/frakt-sdk';

import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface HarvestLiquidityTransactionParams {
  router: MainRouterView;
  secondaryReward: SecondaryRewardView[];
}

export interface HarvestLiquidityTransactionRawParams
  extends HarvestLiquidityTransactionParams,
    WalletAndConnection {}

export const rawHarvestLiquidity = async ({
  router,
  connection,
  wallet,
  secondaryReward,
}: HarvestLiquidityTransactionRawParams): Promise<any> => {
  const transaction = new web3.Transaction();

  const harvestInstruction = await pools.harvestInFusion(
    new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
    new AnchorProvider(connection, wallet, null),
    wallet.publicKey,
    new web3.PublicKey(router.tokenMintInput),
    new web3.PublicKey(router.tokenMintOutput),
  );

  transaction.add(harvestInstruction);

  const secondaryRewardsTokensMints = secondaryReward.map(
    ({ tokenMint }) => new web3.PublicKey(tokenMint),
  );

  const secondaryHarvestInstructions = await pools.harvestSecondaryReward(
    new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
    new AnchorProvider(connection, wallet, null),
    wallet.publicKey,
    new web3.PublicKey(router.tokenMintInput),
    new web3.PublicKey(router.tokenMintOutput),
    secondaryRewardsTokensMints,
  );

  if (secondaryHarvestInstructions?.length) {
    transaction.add(...secondaryHarvestInstructions);
  }

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawHarvestLiquidity, {
  onSuccessMessage: {
    message: 'Rewards harvested successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const harvestLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
