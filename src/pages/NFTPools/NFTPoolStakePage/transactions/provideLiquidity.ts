import { BN } from '@project-serum/anchor';
import {
  Liquidity,
  LiquidityPoolKeysV4,
  LiquiditySide,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type ProvideLiquidity = (props: {
  connection: Connection;
  wallet: WalletContextState;
  poolToken: TokenInfo;
  poolTokenAmount: BN;
  solAmount: BN;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  fixedSide: LiquiditySide;
}) => Promise<boolean>;

export const provideLiquidity: ProvideLiquidity = async ({
  connection,
  wallet,
  poolToken,
  poolTokenAmount,
  solAmount,
  raydiumLiquidityPoolKeys,
  fixedSide,
}) => {
  try {
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

    const amountInA = getCurrencyAmount(poolToken, poolTokenAmount);
    const amountInB = getCurrencyAmount(SOL_TOKEN, solAmount);

    const { transaction, signers } =
      await Liquidity.makeAddLiquidityTransaction({
        connection,
        poolKeys: raydiumLiquidityPoolKeys,
        userKeys: {
          tokenAccounts,
          owner: wallet.publicKey,
        },
        amountInA,
        amountInB,
        fixedSide,
      });

    const { blockhash } = await connection.getRecentBlockhash();

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

    await connection.confirmTransaction(txid, 'finalized');

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
