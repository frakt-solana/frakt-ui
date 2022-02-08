import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';

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
}: SwapTransactionRawParams): Promise<void> => {
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

  const amountIn = getCurrencyAmount(baseToken, baseAmount);
  const amountOut = getCurrencyAmount(quoteToken, quoteAmount);

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
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawRaydiumSwap, {
  onSuccessMessage: 'Swap made successfully',
  onErrorMessage: 'Swap failed',
});

export const raydiumSwap =
  ({ connection, wallet }: WalletAndConnection) =>
  (params: SwapTransactionParams): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
