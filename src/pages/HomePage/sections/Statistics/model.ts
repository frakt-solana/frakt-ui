export interface NftPoolsStats {
  lockedNftsInPools: number;
  poolsTvl: number;
  totalVolume: number;
}

export interface LoansStats {
  lockedNftsInLoans: number;
  loansVolumeAllTime: number;
  loansVolume7Days: number;
  TVL: number;
  issuedIn24Hours: number;
  liquidatedIn24Hours: number;
  paidBackIn24Hours: number;
  totalIssued: number;
}

export interface Stats {
  nftsLocked: number;
  TVL: number;
}
