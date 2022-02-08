import {
  Liquidity,
  LiquidityPoolKeysV4,
  LiquiditySide,
} from '@raydium-io/raydium-sdk';
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
}: AddLiquidityTransactionRawParams): Promise<void> => {
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
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawAddRaydiumLiquidity, {
  onSuccessMessage: 'successfully',
  onErrorMessage: 'Transaction failed',
});

export const addRaydiumLiquidity =
  ({ connection, wallet }: WalletAndConnection) =>
  (params: AddLiquidityTransactionParams): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
