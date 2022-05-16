import { Prism } from '@prism-hq/prism-ag';
import { TokenInfo } from '@solana/spl-token-registry';

import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface PrismSwapTransactionParams {
  receiveToken: string;
  payToken: string;
  payValue: string;
  tokensList: TokenInfo[];
  slippage?: number;
}

export interface PrismSwapTransactionRawParams
  extends PrismSwapTransactionParams,
    WalletAndConnection {}

export const rawPrismSwap = async ({
  receiveToken,
  payToken,
  wallet,
  connection,
  tokensList,
  payValue,
  slippage = 1,
}: PrismSwapTransactionRawParams): Promise<void> => {
  const initPrism = async () => {
    return await Prism.init({
      user: wallet.publicKey,
      connection: connection,
      slippage: slippage,
      tokenList: { tokens: tokensList },
    });
  };

  const prism = await initPrism();

  await prism.setSigner(wallet);
  await prism.loadRoutes(payToken, receiveToken);

  const routes = await prism.getRoutes(Number(payValue));

  await prism.swap(routes[0]);
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawPrismSwap, {
  onSuccessMessage: {
    message: 'Swap made successfully',
  },
  onErrorMessage: { message: 'Swap failed' },
});

export const prismSwap = createTransactionFuncFromRaw(wrappedAsyncWithTryCatch);
