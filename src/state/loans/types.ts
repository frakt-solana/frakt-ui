export interface LoanView {
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
  amountToRepay: number;
  rewardAmount: number;
  feeAmount: number;
  royaltyAddress: string;
  royaltyAmount: number;
  rewardInterestRate: number;
  feeInterestRate: number;
  royaltyInterestRate: number;
  loanStatus: string;
  loanType: string;
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

export interface Lending {
  activeLoansCount: number;
  collectionsCount: number;
  deposit?: {
    amount: number;
    depositPubkey: string;
    liquidityPool: string;
    stakedAt: number;
    stakedAtCumulative: number;
    updatedAt: string;
  };
  user?: string;
  liquidityPool: {
    amountOfStaked: number;
    apr: number;
    cumulative: number;
    feeInterestRatePrice: number;
    feeInterestRateTime: number;
    id: number;
    lastTime: number;
    liqOwner: string;
    liquidityAmount: number;
    liquidityPoolPubkey: string;
    oldCumulative: number;
    period: number;
    rewardInterestRatePrice: number;
    rewardInterestRateTime: number;
    updatedAt: string;
    userRewardsAmount: number;
  };
}
