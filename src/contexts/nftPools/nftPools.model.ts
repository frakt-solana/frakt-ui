import { ProgramAccount } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type FetchDataFunc = () => Promise<void>;

export type NftPoolsContextValues = {
  poolsState: PoolsState;
  loading: boolean;
  initialFetch: FetchDataFunc;
  refetch: FetchDataFunc;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
};

export type CommunityPoolAccount = {
  authority: PublicKey;
  createdAt: BN;
  fractionMint: PublicKey;
  fractionsSupply: BN;
  state: { active: any }; //! WTF
  tokenProgram: PublicKey;
  tokenTypeCount: BN;
};
export type CommunityPoolProgramAccount = ProgramAccount<CommunityPoolAccount>;

export type LotteryTicketAccount = {
  communityPool: PublicKey;
  lotteryTicketState: { used: any }; //! WTF
  ticketHolder: PublicKey;
  winningSafetyBox: PublicKey;
};
export type LotteryTicketProgramAccount = ProgramAccount<LotteryTicketAccount>;

export type PoolWhitelistAccount = {
  publicKey: PublicKey;
  account: {
    communityPool: PublicKey;
    whitelistType: { creatorWhitelist: any }; //! WTF
    whitelistedAddress: PublicKey;
  };
};
export type PoolWhitelistProgramAccount = ProgramAccount<PoolWhitelistAccount>;

export type SafetyDepositBoxAccount = {
  communityPool: PublicKey;
  nftMint: PublicKey;
  safetyBoxState: { empty: any }; //! WTF
  storeNftTokenAccount: PublicKey;
};
export type SafetyDepositBoxProgramAccount =
  ProgramAccount<SafetyDepositBoxAccount>;

export type PoolsState = {
  communityPools: CommunityPoolProgramAccount[];
  lotteryTickets: LotteryTicketProgramAccount[];
  poolWhitelists: PoolWhitelistProgramAccount[];
  safetyDepositBoxes: SafetyDepositBoxProgramAccount[];
};
