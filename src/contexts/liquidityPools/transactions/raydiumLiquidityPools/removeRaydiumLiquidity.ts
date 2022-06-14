import { TokenInfo } from '@solana/spl-token-registry';
import { utils, raydium, web3 } from '@frakt-protocol/frakt-sdk';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface RemoveLiquidityTransactionParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  poolConfig: raydium.LiquidityPoolKeysV4;
  amount: raydium.TokenAmount;
}

export interface RemoveLiquidityTransactionRawParams
  extends RemoveLiquidityTransactionParams,
    WalletAndConnection {}

export const rawRemoveRaydiumLiquidity = async ({
  connection,
  wallet,
  baseToken,
  quoteToken = SOL_TOKEN,
  poolConfig,
  amount,
}: RemoveLiquidityTransactionRawParams): Promise<boolean> => {
  const tokenAccounts = (
    await Promise.all(
      [baseToken.address, quoteToken.address, poolConfig.lpMint].map((mint) =>
        utils.getTokenAccount({
          tokenMint: new web3.PublicKey(mint),
          owner: wallet.publicKey,
          connection,
        }),
      ),
    )
  ).filter((tokenAccount) => tokenAccount);

  const { transaction, signers } =
    await raydium.Liquidity.makeRemoveLiquidityTransaction({
      connection,
      poolKeys: poolConfig,
      userKeys: {
        tokenAccounts: tokenAccounts,
        owner: wallet.publicKey,
      },
      amountIn: amount,
    });

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    wallet,
  });

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(
  rawRemoveRaydiumLiquidity,
  {
    onSuccessMessage: {
      message: 'Liquidity removed successfully',
    },
    onErrorMessage: { message: 'Transaction failed' },
  },
);

export const removeRaydiumLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
