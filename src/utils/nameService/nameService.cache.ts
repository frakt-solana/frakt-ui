import { NameServiceResponse } from './nameService.model';

export const nameServiceCache: {
  [walletPublicKey: string]: NameServiceResponse;
} = {};
