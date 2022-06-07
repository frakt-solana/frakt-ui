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
