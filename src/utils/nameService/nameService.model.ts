import { Connection } from '@solana/web3.js';

export interface NameServiceResponse {
  domain: string | null;
  twitterHandle: string | null;
}

export type useNameServiceInfoType = () => {
  error: Error;
  loading: boolean;
  info: NameServiceResponse;
  getInfo: (walletPublicKey: string, connection: Connection) => Promise<void>;
};
