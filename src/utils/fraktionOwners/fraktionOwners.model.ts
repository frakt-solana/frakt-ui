interface TokenHoldersData {
  address: string;
  amount: number;
  decimals: number;
  owner: string;
  rank: number;
}

export interface TokenHoldersInfo {
  data: TokenHoldersData[];
  total: number;
}
