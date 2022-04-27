import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  harvestInFusion,
  harvestSecondaryReward,
} from '@frakters/frkt-multiple-reward';
import { Provider } from '@project-serum/anchor';

import { FusionPool } from './../../../../contexts/liquidityPools/liquidityPools.model';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type Harvest = (props: {
  wallet: WalletContextState;
  connection: Connection;
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

    const transactionInventory = new Transaction();
    const transactionLiquidity = new Transaction();

    const inventoryHarvestInstruction = await harvestInFusion(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(inventoryRouter.tokenMintInput),
      new PublicKey(inventoryRouter.tokenMintOutput),
    );

    const inventorySecondaryRewardsInstructions = await harvestSecondaryReward(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(inventoryRouter.tokenMintInput),
      new PublicKey(inventoryRouter.tokenMintOutput),
      inventorySecondaryRewards?.map(
        ({ rewards }) => new PublicKey(rewards?.tokenMint),
      ) || [],
    );

    transactionInventory.add(inventoryHarvestInstruction);
    if (inventorySecondaryRewardsInstructions?.length) {
      transactionInventory.add(...inventorySecondaryRewardsInstructions);
    }

    const liquidityHarvestInstruction = await harvestInFusion(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(liquidityRouter.tokenMintInput),
      new PublicKey(liquidityRouter.tokenMintOutput),
    );

    const liquiditySecondaryRewardsInstructions = await harvestSecondaryReward(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(liquidityRouter.tokenMintInput),
      new PublicKey(liquidityRouter.tokenMintOutput),
      liquiditySecondaryRewards?.map(
        ({ rewards }) => new PublicKey(rewards?.tokenMint),
      ) || [],
    );

    transactionLiquidity.add(liquidityHarvestInstruction);
    if (liquiditySecondaryRewardsInstructions?.length) {
      transactionLiquidity.add(...liquiditySecondaryRewardsInstructions);
    }

    const transactions = [transactionInventory, transactionLiquidity];

    const { blockhash } = await connection.getRecentBlockhash();

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
      txids.map((txid) => connection.confirmTransaction(txid, 'finalized')),
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
