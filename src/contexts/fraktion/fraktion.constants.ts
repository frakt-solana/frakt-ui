const IS_DEVNET = process.env.REACT_APP_NETWORK === 'devnet';

export const VAULTS_AND_META_CACHE_URL = IS_DEVNET
  ? 'https://devnet-metas-cacher.herokuapp.com/'
  : 'https://fraktion-meta-cache.herokuapp.com/';
