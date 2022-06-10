export * from '@frakters/nft-lending-v2/lib/accounts';

export interface LoanWithMetadata {
  loan: {
    nftName: string;
    nftImageUrl: string;
    _id: string;
    loanPubkey: string;
    user: string;
    nftMint: string;
    nftUserTokenAccount: string;
    liquidityPool: string;
    collectionInfo: string;
    startedAt: number;
    expiredAt: number;
    finishedAt: number;
    originalPrice: number;
    amountToGet: number;
    rewardAmount: number;
    feeAmount: number;
    royaltyAmount: number;
    rewardInterestRate: number;
    feeInterestRate: number;
    royaltyInterestRate: number;
    loanStatus: string;
    loanType: string;
  };
  metadata: {
    name: string;
    image: string;
  };
}

export interface LoansPoolInfo {
  apr?: number;
  loans?: number;
  totalSupply?: number;
  depositAmount?: number;
  utilizationRate?: number;
  rewardAmount?: number;
  totalBorrowed?: number;
}
