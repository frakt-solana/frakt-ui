import { WalletAndConnection } from '../model';

export const createTransactionFuncFromRaw =
  <P, V>(func: (params: P) => V) =>
  ({ connection, wallet }: WalletAndConnection) =>
  (params: Omit<P, keyof WalletAndConnection>): V =>
    func({ connection, wallet, ...params } as unknown as P);
