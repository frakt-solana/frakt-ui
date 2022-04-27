import {
  unstakeInFusion as unstakeInFusionIx,
  harvestInFusion as harvestInFusionIx,
  harvestSecondaryReward as harvestSecondaryRewardIx,
} from '@frakters/frkt-multiple-reward';
import { BN, Provider } from '@project-serum/anchor';
import {
  Liquidity,
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import {
  FusionPool,
  getTokenAccount,
  RaydiumPoolInfo,
} from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type UnstakeAndRemoveLiquidity = (props: {
  connection: Connection;
  wallet: WalletContextState;
  liquidityFusion: FusionPool;
  poolToken: TokenInfo;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  amount: number;
}) => Promise<boolean>;

export const unstakeAndRemoveLiquidity: UnstakeAndRemoveLiquidity = async ({
  connection,
  wallet,
  liquidityFusion,
  poolToken,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
  amount,
}) => {
  try {
    const amountBN = new BN(amount * 10 ** raydiumPoolInfo?.lpDecimals);

    const { router } = liquidityFusion;

    const unstakeTransaction = new Transaction();

    const stakeAccount = liquidityFusion?.stakeAccounts?.find(
      ({ stakeOwner }) => {
        return stakeOwner === wallet?.publicKey?.toBase58();
      },
    );

    if (Number(stakeAccount.unstakedAtCumulative)) {
      const harvestInstruction = await harvestInFusionIx(
        new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        new Provider(connection, wallet, null),
        wallet.publicKey,
        new PublicKey(router.tokenMintInput),
        new PublicKey(router.tokenMintOutput),
      );

      unstakeTransaction.add(harvestInstruction);
    }

    const rewardsTokenMint = liquidityFusion?.secondaryRewards.map(
      ({ rewards }) => new PublicKey(rewards.tokenMint),
    );

    if (liquidityFusion?.secondaryRewards.length) {
      const secondaryHarvestInstruction = await harvestSecondaryRewardIx(
        new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        new Provider(connection, wallet, null),
        wallet.publicKey,
        new PublicKey(router.tokenMintInput),
        new PublicKey(router.tokenMintOutput),
        rewardsTokenMint,
      );

      unstakeTransaction.add(...secondaryHarvestInstruction);
    }

    const unstakeInstruction = await unstakeInFusionIx(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(router.tokenMintInput),
      new PublicKey(router.tokenMintOutput),
      amountBN,
    );

    unstakeTransaction.add(unstakeInstruction);

    const tokenAccounts = (
      await Promise.all(
        [
          poolToken.address,
          SOL_TOKEN.address,
          raydiumLiquidityPoolKeys?.lpMint?.toBase58(),
        ].map((mint) =>
          getTokenAccount({
            tokenMint: new PublicKey(mint),
            owner: wallet.publicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const {
      transaction: removeLiquidityTransaction,
      signers: removeLiquidityTransactionSigners,
    } = await Liquidity.makeRemoveLiquidityTransaction({
      connection,
      poolKeys: raydiumLiquidityPoolKeys,
      userKeys: {
        tokenAccounts: tokenAccounts,
        owner: wallet.publicKey,
      },
      amountIn: new TokenAmount(
        new Token(raydiumLiquidityPoolKeys.lpMint, raydiumPoolInfo.lpDecimals),
        amountBN,
      ),
    });

    const transactions = [unstakeTransaction, removeLiquidityTransaction];

    const { blockhash } = await connection.getRecentBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    removeLiquidityTransaction.sign(...removeLiquidityTransactionSigners);

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
      type: NotifyType.INFO,
    });

    await Promise.all(
      txids.map((txid) => connection.confirmTransaction(txid, 'finalized')),
    );

    notify({
      message: 'Unstaked successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Unstake failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
