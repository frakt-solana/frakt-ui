import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  utils,
  raydium,
  pools,
  BN,
  AnchorProvider,
  web3,
} from '@frakt-protocol/frakt-sdk';

import {
  FusionPool,
  RaydiumPoolInfo,
} from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type UnstakeAndRemoveLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityFusion: FusionPool;
  poolToken: TokenInfo;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
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

    const unstakeTransaction = new web3.Transaction();

    const stakeAccount = liquidityFusion?.stakeAccounts?.find(
      ({ stakeOwner }) => {
        return stakeOwner === wallet?.publicKey?.toBase58();
      },
    );

    if (Number(stakeAccount.unstakedAtCumulative)) {
      const harvestInstruction = await pools.harvestInFusion(
        new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        new AnchorProvider(connection, wallet, null),
        wallet.publicKey,
        new web3.PublicKey(router.tokenMintInput),
        new web3.PublicKey(router.tokenMintOutput),
      );

      unstakeTransaction.add(harvestInstruction);
    }

    const rewardsTokenMint = liquidityFusion?.secondaryRewards.map(
      ({ rewards }) => new web3.PublicKey(rewards.tokenMint),
    );

    if (liquidityFusion?.secondaryRewards.length) {
      const secondaryHarvestInstruction = await pools.harvestSecondaryReward(
        new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        new AnchorProvider(connection, wallet, null),
        wallet.publicKey,
        new web3.PublicKey(router.tokenMintInput),
        new web3.PublicKey(router.tokenMintOutput),
        rewardsTokenMint,
      );

      unstakeTransaction.add(...secondaryHarvestInstruction);
    }

    const unstakeInstruction = await pools.unstakeInFusion(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new AnchorProvider(connection, wallet, null),
      wallet.publicKey,
      new web3.PublicKey(router.tokenMintInput),
      new web3.PublicKey(router.tokenMintOutput),
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
          utils.getTokenAccount({
            tokenMint: new web3.PublicKey(mint),
            owner: wallet.publicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const {
      transaction: removeLiquidityTransaction,
      signers: removeLiquidityTransactionSigners,
    } = await raydium.Liquidity.makeRemoveLiquidityTransaction({
      connection,
      poolKeys: raydiumLiquidityPoolKeys,
      userKeys: {
        tokenAccounts: tokenAccounts,
        owner: wallet.publicKey,
      },
      amountIn: new raydium.TokenAmount(
        new raydium.Token(
          raydiumLiquidityPoolKeys.lpMint,
          raydiumPoolInfo.lpDecimals,
        ),
        amountBN,
      ),
    });

    const transactions = [unstakeTransaction, removeLiquidityTransaction];

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    removeLiquidityTransaction.sign(...removeLiquidityTransactionSigners);

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txidUnstake = await connection.sendRawTransaction(
      signedTransactions[0].serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txidUnstake, blockhash, lastValidBlockHeight },
      'finalized',
    );

    const txidWithdraw = await connection.sendRawTransaction(
      signedTransactions[1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidWithdraw, blockhash, lastValidBlockHeight },
      'finalized',
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
