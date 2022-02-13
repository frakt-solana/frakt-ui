import { harvestSecondaryReward } from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';
import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export interface HarvestSecondaryLiquidityTransactionParams {
  router: MainRouterView;
  stakeAccount: StakeAccountView;
  secondaryReward: SecondaryRewardView[];
}

export interface HarvestSecondaryLiquidityTransactionRawParams
  extends HarvestSecondaryLiquidityTransactionParams,
    WalletAndConnection {}

export const rowHarvestSecondaryLiquidity = async ({
  router,
  stakeAccount,
  connection,
  wallet,
  secondaryReward,
}: HarvestSecondaryLiquidityTransactionRawParams): Promise<void> => {
  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  await harvestSecondaryReward(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    rewardsTokenMint,
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowHarvestSecondaryLiquidity,
  {
    onSuccessMessage: 'Liquidity harvested successfully',
    onErrorMessage: 'Transaction failed',
  },
);

export const harvestSecondaryLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
