import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { pools } from '@frakt-protocol/frakt-sdk';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { getTokenAccount } from '../../liquidityPools.helpers';

export interface SwapTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: LiquidityPoolKeysV4;
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
        getTokenAccount({
          tokenMint: new PublicKey(mint),
          owner: wallet.publicKey,
          connection,
        }),
      ),
    )
  ).filter((tokenAccount) => tokenAccount);

  const amountIn = pools.getCurrencyAmount(baseToken, baseAmount);
  const amountOut = pools.getCurrencyAmount(quoteToken, quoteAmount);

  const { transaction, signers } = await Liquidity.makeSwapTransaction({
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
