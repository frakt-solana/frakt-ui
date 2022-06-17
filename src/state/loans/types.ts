export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  timeBased: {
    returnPeriodDays: number; // 14
    ltvPercents: number; // 40
    fee: string; // 0.100
    feeDiscountPercents: string; // 2
    repayValue: string; // 1.101
    liquidityPoolPubkey: string;
    loanValue: string; // 1.020
  };
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40
    borrowAPRPercents: number; // 10
    collaterizationRate: number; // 0.1
  };
}

export interface LiquidityPool {
  pubkey: string;
  isPriceBased: boolean;
  name: string;
  imageUrl: string[];

  totalLiquidity: number;
  totalBorrowed: number;

  utilizationRate: number;
  depositApr: number;
  borrowApr?: number;

  activeloansAmount: number;

  collectionsAmount: number;

  userDeposit?: {
    pubkey: string;
    harvestAmount: number;
    depositAmount: number;
    depositAmountLamports: string; //? Lamports
  };
  userActiveLoansAmount?: number;
}

export interface Loan {
  pubkey: string;
  mint: string;
  name: string;
  imageUrl: string;
  isPriceBased: boolean;

  loanValue: number; //? SOL
  repayValue: number; //? SOL
  repayValueLamports: string; //? Lamports

  startedAt: string; //? Date
  expiredAt?: string; //? Date

  liquidityPool: string;
  collectionInfo: string;
  royaltyAddress: string;

  liquidationPrice?: number; //? 1.23456 (SOL)
  valuation?: number; //? 1.23456 (SOL)
  health?: number; //? 80(%) 0-100%
}
