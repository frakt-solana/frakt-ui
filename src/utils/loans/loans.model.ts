import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

import { UserNFT } from '../../contexts/userTokens';

export interface CreateLoanProps {
  wallet: WalletContextState;
  connection: Connection;
  nft: UserNFT;
}

export interface GetBackProps {
  wallet: WalletContextState;
  connection: Connection;
  loan: LoanProps;
}

export interface LoanProps {
  amount: number;
  duration: number;
  id: string;
  nft: string;
  nft_address: string;
  nft_uri: string;
  order: string;
  return_amount: number;
  status_id: string;
  startedAt: string;
  expiredAt: string;
}

export interface LoanNftData {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  external_url: string;
  image: string;
  attributes: [];
  collection: { name: string; family: string };
}

export interface AvailableCollectionsProps {
  candymachine_address: [];
  createdAt: string;
  floorPrice: number;
  id: string;
  name: string;
  nfts: [];
  returnAmount: number;
  status_id: string;
  valuation: number;
}

export interface LoanWithNftData extends LoanProps {
  nftData: LoanNftData;
}
