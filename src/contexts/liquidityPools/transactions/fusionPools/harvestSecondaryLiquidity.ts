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
  connection,
  wallet,
  secondaryReward,
}: HarvestSecondaryLiquidityTransactionRawParams): Promise<void> => {
  const rewardsTokenMint = secondaryReward.map(
    ({ tokenMint }) => new PublicKey(tokenMint),
  );

  console.log({
    PROGRAM: new PublicKey(FUSION_PROGRAM_PUBKEY),
    PROVIDER: new Provider(connection, wallet, null),
    WALLET: wallet.publicKey,
    INPUT: new PublicKey(router.tokenMintInput).toBase58(),
    OUTPUT: new PublicKey(router.tokenMintOutput).toBase58(),
    rewardsTokenMint,
  });

  await harvestSecondaryReward(
    new PublicKey(FUSION_PROGRAM_PUBKEY),
    new Provider(connection, wallet, null),
    wallet.publicKey,
    new PublicKey(router.tokenMintInput),
    new PublicKey(router.tokenMintOutput),
    rewardsTokenMint,
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
