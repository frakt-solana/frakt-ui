const IS_DEVNET = process.env.REACT_APP_NETWORK === 'devnet';

export const VAULTS_AND_META_CACHE_URL = IS_DEVNET
  ? 'https://devnet-fraktionalizer-auctions.herokuapp.com/'
  : 'https://fraktion-meta-cache.herokuapp.com/';
