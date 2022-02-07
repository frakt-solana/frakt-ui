import { notify, useBFF } from '../index';
import API from '../../utils/cacher';

const REGISTRAR_URL = 'https://fraktion-tokens-register.herokuapp.com/market';
const MARKETS_URL = 'https://fraktion-markets-pools-endpoin.herokuapp.com/';

const DEPRECATED_MARKETS = [
  'EQ5XjC1neq4FbqLUaeHLx48CTougsPYdsGgti4KqEFUT',
  'dvQF6YNQvQ2dQkMyt3rW7ibypCkHJDgVAJvZz6A6gZx',
];

export const getMarketsFromOldCacher = async (): Promise<
  Array<{
    address: string;
    baseMint: string;
    programId: string;
  }>
> => {
  try {
    const res = await fetch(MARKETS_URL);
    const { fraktionMarkets } = await res.json();
    return fraktionMarkets
      .map((market) => {
        return {
          address: market.ownAddress,
          baseMint: market.baseMint,
          programId: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
        };
      })
      .filter((market) => !DEPRECATED_MARKETS.includes(market.address));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const getMarketsFromBFF = (): Promise<
  {
    address: string;
    baseMint: string;
    programId: string;
  }[]
> => {
  try {
    return API.getMarkets();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const getMarkets = useBFF()
  ? getMarketsFromBFF
  : getMarketsFromOldCacher;

export const registerMarket = async (
  tickerName: string,
  marketPubkey: string,
  baseMint: string,
): Promise<boolean> => {
  try {
    const res = await fetch(REGISTRAR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${tickerName}/SOL`,
        address: marketPubkey,
        baseMint,
      }),
    });

    const data = await res.json();

    if (data?.success) {
      notify({
        message: 'Market regitered successfully',
        description: 'Market registration can take up to an hour',
        type: 'success',
      });
    } else {
      notify({
        message: 'Market registration failed',
        type: 'error',
      });
      return false;
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    notify({
      message: 'Market registration failed',
      type: 'error',
    });
    return false;
  }
};
