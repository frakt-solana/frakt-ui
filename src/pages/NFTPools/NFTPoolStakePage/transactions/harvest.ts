import { web3, pools } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { FusionPool } from './../../../../contexts/liquidityPools/liquidityPools.model';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';
import { captureSentryError } from '../../../../utils/sentry';

type Harvest = (props: {
  wallet: WalletContextState;
  connection: web3.Connection;
  inventoryFusionPool: FusionPool;
  liquidityFusionPool: FusionPool;
}) => Promise<boolean>;

export const harvest: Harvest = async ({
  wallet,
  connection,
  inventoryFusionPool,
  liquidityFusionPool,
}) => {
  try {
    const {
      router: inventoryRouter,
      secondaryRewards: inventorySecondaryRewards,
    } = inventoryFusionPool;
    const {
      router: liquidityRouter,
      secondaryRewards: liquiditySecondaryRewards,
    } = liquidityFusionPool;

    const transactionInventory = new web3.Transaction();
    const transactionLiquidity = new web3.Transaction();

    const inventoryHarvestInstruction = await pools.harvestInFusion(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      connection,
      wallet.publicKey,
      new web3.PublicKey(inventoryRouter.tokenMintInput),
      new web3.PublicKey(inventoryRouter.tokenMintOutput),
    );

    const inventorySecondaryRewardsInstructions =
      await pools.harvestSecondaryReward(
        new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        connection,
        wallet.publicKey,
        new web3.PublicKey(inventoryRouter.tokenMintInput),
        new web3.PublicKey(inventoryRouter.tokenMintOutput),
        inventorySecondaryRewards?.map(
          ({ rewards }) => new web3.PublicKey(rewards?.tokenMint),
        ) || [],
      );

    transactionInventory.add(inventoryHarvestInstruction);
    if (inventorySecondaryRewardsInstructions?.length) {
      transactionInventory.add(...inventorySecondaryRewardsInstructions);
    }

    const liquidityHarvestInstruction = await pools.harvestInFusion(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      connection,
      wallet.publicKey,
      new web3.PublicKey(liquidityRouter.tokenMintInput),
      new web3.PublicKey(liquidityRouter.tokenMintOutput),
    );

    const liquiditySecondaryRewardsInstructions =
      await pools.harvestSecondaryReward(
        new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        connection,
        wallet.publicKey,
        new web3.PublicKey(liquidityRouter.tokenMintInput),
        new web3.PublicKey(liquidityRouter.tokenMintOutput),
        liquiditySecondaryRewards?.map(
          ({ rewards }) => new web3.PublicKey(rewards?.tokenMint),
        ) || [],
      );

    transactionLiquidity.add(liquidityHarvestInstruction);
    if (liquiditySecondaryRewardsInstructions?.length) {
      transactionLiquidity.add(...liquiditySecondaryRewardsInstructions);
    }

    const transactions = [transactionInventory, transactionLiquidity];

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txids = await Promise.all(
      signedTransactions.map((signedTransaction) =>
        connection.sendRawTransaction(
          signedTransaction.serialize(),
          // { skipPreflight: true },
        ),
      ),
    );

    notify({
      message: 'Transactions sent',
      // description: onSuccessMessage?.description,
      type: NotifyType.INFO,
    });

    await Promise.all(
      txids.map((txid) =>
        connection.confirmTransaction(
          { signature: txid, blockhash, lastValidBlockHeight },
          'finalized',
        ),
      ),
    );

    notify({
      message: 'Harvested successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Harvest failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'harvestInNftPool',
      params: { inventoryFusionPool, liquidityFusionPool },
    });

    return false;
  }
};
