import { Prism } from '@prism-hq/prism-ag';

import { TokenInfo } from '@solana/spl-token-registry';

import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface PrismaSwapTransactionParams {
  receiveToken: string;
  payToken: string;
  payValue: string;
  tokensList: TokenInfo[];
  slippage?: number;
}

export interface PrismaSwapTransactionRawParams
  extends PrismaSwapTransactionParams,
    WalletAndConnection {}

export const rawPrismaSwap = async ({
  receiveToken,
  payToken,
  wallet,
  connection,
  tokensList,
  payValue,
  slippage = 1,
}: PrismaSwapTransactionRawParams): Promise<void> => {
  const initPrism = async () => {
    return await Prism.init({
      user: wallet.publicKey,
      connection: connection,
      slippage: slippage,
      tokenList: { tokens: tokensList },
    });
  };

  const prisma = await initPrism();

  await prisma.setSigner(wallet);
  await prisma.loadRoutes(payToken, receiveToken);

  const routes = await prisma.getRoutes(Number(payValue));

  await prisma.swap(routes[0]);
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawPrismaSwap, {
  onSuccessMessage: {
    message: 'Swap made successfully',
  },
  onErrorMessage: { message: 'Swap failed' },
});

export const prismaSwap = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);