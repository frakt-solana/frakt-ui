export interface GraceListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  isPriceBased: boolean;
  loanValue: number;
  liquidationPrice: number;
  liquidationPriceLamports: string;
  valuation: number;
  startedAt: string;
  expiredAt: string;
}

export interface RaffleListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
}
export interface WonRaffleListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
}
export interface LotteryTickets {
  nftMints: string[];
  nextRefillIn?: string;
}
