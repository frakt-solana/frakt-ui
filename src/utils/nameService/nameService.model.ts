import { web3 } from '@frakt-protocol/frakt-sdk';

export interface NameServiceResponse {
  domain: string | null;
  twitterHandle: string | null;
}

export type useNameServiceInfoType = () => {
  error: Error;
  loading: boolean;
  info: NameServiceResponse;
  getInfo: (
    walletPublicKey: string,
    connection: web3.Connection,
  ) => Promise<void>;
};
