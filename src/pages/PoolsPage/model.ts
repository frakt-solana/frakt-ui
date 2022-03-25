export interface RawPoolStatsV1 {
  amm_id: string;
  apy: number;
  fee_7d: number;
  fee_7d_quote: number;
  fee_24h: number;
  fee_24h_quote: number;
  liquidity: number;
  lp_mint: string;
  lp_price: number;
  market: string;
  name: string;
  official: boolean;
  pair_id: string;
  price: number;
  token_amount_coin: number;
  token_amount_lp: number;
  token_amount_pc: number;
  volume_7d: number;
  volume_7d_quote: number;
  volume_24h: number;
  volume_24h_quote: number;
}

export interface RawPoolStatsV2 {
  amm_id: string;
  apr7d: number;
  apr24h: number;
  apr30d: number;
  fee7d: number;
  fee7dQuote: number;
  fee24h: number;
  fee24hQuote: number;
  fee30d: number;
  fee30dQuote: number;
  liquidity: number;
  lpMint: string;
  lpPrice: number;
  market: string;
  name: string;
  price: number;
  tokenAmountCoin: number;
  tokenAmountLp: number;
  tokenAmountPc: number;
  volume7d: number;
  volume7dQuote: number;
  volume24h: number;
  volume24hQuote: number;
  volume30d: number;
  volume30dQuote: number;
}

export interface PoolStats {
  apr: number;
  fee7d: number;
  fee24h: number;
  liquidity: number;
  volume: number;
}
