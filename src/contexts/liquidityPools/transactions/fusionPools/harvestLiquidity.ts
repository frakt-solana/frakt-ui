import {
  harvestInFusion,
  harvestSecondaryReward,
} from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

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
  const transaction = new Transaction();

  const harvestInstruction = await harvestInFusion(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
  );

  transaction.add(harvestInstruction);

  const secondaryRewardsTokensMints = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  const secondaryHarvestInstructions = await harvestSecondaryReward(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
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
