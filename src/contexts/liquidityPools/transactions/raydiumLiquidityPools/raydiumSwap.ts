import {
  web3,
  pools,
  utils,
  BN,
  TokenInfo,
  raydium,
} from '@frakt-protocol/frakt-sdk';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface SwapTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: raydium.LiquidityPoolKeysV4;
}

export interface SwapTransactionRawParams
  extends SwapTransactionParams,
    WalletAndConnection {}

export const rawRaydiumSwap = async ({
  baseToken,
  baseAmount,
  quoteToken = SOL_TOKEN,
  quoteAmount,
  poolConfig,
  connection,
  wallet,
}: SwapTransactionRawParams): Promise<boolean | void> => {
  const tokenAccounts = (
    await Promise.all(
      [baseToken.address, quoteToken.address].map((mint) =>
        utils.getTokenAccount({
          tokenMint: new web3.PublicKey(mint),
          owner: wallet.publicKey,
          connection,
        }),
      ),
    )
  ).filter((tokenAccount) => tokenAccount);

  const amountIn = pools.getCurrencyAmount(baseToken, baseAmount);
  const amountOut = pools.getCurrencyAmount(quoteToken, quoteAmount);

  const { transaction, signers } = await raydium.Liquidity.makeSwapTransaction({
    connection,
    poolKeys: poolConfig,
    userKeys: {
      tokenAccounts,
      owner: wallet.publicKey,
    },
    amountIn,
    amountOut,
    fixedSide: 'in',
  });

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    wallet,
  });

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawRaydiumSwap, {
  onSuccessMessage: {
    message: 'Swap made successfully',
  },
  onErrorMessage: { message: 'Swap failed' },
});

export const raydiumSwap = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
