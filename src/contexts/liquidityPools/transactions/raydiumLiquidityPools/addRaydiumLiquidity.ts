import {
  Liquidity,
  LiquidityPoolKeysV4,
  LiquiditySide,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';

export interface AddLiquidityTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: LiquidityPoolKeysV4;
  fixedSide: LiquiditySide;
}

export interface AddLiquidityTransactionRawParams
  extends AddLiquidityTransactionParams,
    WalletAndConnection {}

const rawAddRaydiumLiquidity = async ({
  connection,
  wallet,
  baseToken,
  baseAmount,
  quoteToken = SOL_TOKEN,
  quoteAmount,
  poolConfig,
  fixedSide,
}: AddLiquidityTransactionRawParams): Promise<boolean | null> => {
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

  const amountInA = getCurrencyAmount(baseToken, baseAmount);
  const amountInB = getCurrencyAmount(SOL_TOKEN, quoteAmount);

  const { transaction, signers } = await Liquidity.makeAddLiquidityTransaction({
    connection,
    poolKeys: poolConfig,
    userKeys: {
      tokenAccounts,
      owner: wallet.publicKey,
    },
    amountInA,
    amountInB,
    fixedSide,
  });

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    wallet,
  });

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawAddRaydiumLiquidity, {
  onSuccessMessage: {
    message: 'Liquidity provided successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const addRaydiumLiquidity = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
