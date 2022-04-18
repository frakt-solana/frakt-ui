import {
  Liquidity,
  LiquidityPoolKeysV4,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { getTokenAccount } from '../../liquidityPools.helpers';

export interface RemoveLiquidityTransactionParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  amount: TokenAmount;
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
        getTokenAccount({
          tokenMint: new PublicKey(mint),
          owner: wallet.publicKey,
          connection,
        }),
      ),
    )
  ).filter((tokenAccount) => tokenAccount);

  const { transaction, signers } =
    await Liquidity.makeRemoveLiquidityTransaction({
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
