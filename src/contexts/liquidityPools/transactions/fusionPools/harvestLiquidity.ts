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

import { wrapAsyncWithTryCatch } from '../../../../utils';
import {
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

  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  const secondaryHarvestInstruction = await harvestSecondaryReward(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    rewardsTokenMint,
  );

  transaction.add(...secondaryHarvestInstruction);

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawHarvestLiquidity, {
  onSuccessMessage: 'Liquidity harvested successfully',
  onErrorMessage: 'Transaction failed',
});

export const harvestLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
