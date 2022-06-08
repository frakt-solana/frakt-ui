export type NftSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: NftSortValue;
};

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
