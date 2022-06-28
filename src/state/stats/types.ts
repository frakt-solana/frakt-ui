export interface TotalStats {
  lockedNftsInPools: number;
  poolsTvl: number;
  poolsVolumeAllTime: number;
  totalIssuedInLoans: number;
  loansTvl: number;
  loansVolumeAllTime: number;
}

export interface DailyActivity {
  lockedNftsInLoans: number;
  issuedIn24Hours: number;
  paidBackIn24Hours: number;
  liquidatedIn24Hours: number;
}

export interface LastLoans {
  image: string;
  loanValue: number;
  nftName: string;
}

export interface LedningPools {
  apr: number;
  image: string;
  nftName: string;
  tvl: number;
}

export type StatsState = {
  totalStats: TotalStats;
  dailyActivity: DailyActivity;
  lastLoans: LastLoans[];
  lendingPools: LedningPools[];
};
