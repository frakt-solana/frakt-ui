import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { utils, pools, raydium } from '@frakt-protocol/frakt-sdk';

import { RaydiumPoolInfo } from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';
import { calcRatio } from '../components';

type ProvideLiquidity = (props: {
  connection: Connection;
  wallet: WalletContextState;
  poolToken: TokenInfo;
  poolTokenAmount: number;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
}) => Promise<boolean>;

export const provideLiquidity: ProvideLiquidity = async ({
  connection,
  wallet,
  poolToken,
  poolTokenAmount,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
}) => {
  try {
    const tokenAccounts = (
      await Promise.all(
        [
          poolToken.address,
          SOL_TOKEN.address,
          raydiumLiquidityPoolKeys?.lpMint?.toBase58(),
        ].map((mint) =>
          utils.getTokenAccount({
            tokenMint: new PublicKey(mint),
            owner: wallet.publicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const solTokenAmount = poolTokenAmount * calcRatio(raydiumPoolInfo);

    const poolTokenAmountBN = new BN(
      poolTokenAmount * 10 ** poolToken?.decimals,
    );
    const solTokenAmountBN = new BN(solTokenAmount * 10 ** SOL_TOKEN?.decimals);

    const amountInA = pools.getCurrencyAmount(poolToken, poolTokenAmountBN);
    const amountInB = pools.getCurrencyAmount(SOL_TOKEN, solTokenAmountBN);

    const { transaction, signers } =
      await raydium.Liquidity.makeAddLiquidityTransaction({
        connection,
        poolKeys: raydiumLiquidityPoolKeys,
        userKeys: {
          tokenAccounts,
          owner: wallet.publicKey,
        },
        amountInA,
        amountInB,
        fixedSide: 'b',
      });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    transaction.sign(...signers);

    const signedTransaction = await wallet.signTransaction(transaction);

    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txid, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Liquidity provided successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Liquidity providing failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
