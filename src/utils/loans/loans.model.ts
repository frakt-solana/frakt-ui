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
  loan: LoanInterface;
}

export interface LoanInterface {
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

export interface LoanWithNftData extends LoanInterface {
  nftData: {
    name: string;
    symbol: string;
    description: string;
    seller_fee_basis_points: number;
    external_url: string;
    image: string;
  };
}
