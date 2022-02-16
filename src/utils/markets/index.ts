import { Cacher, IS_BFF_ENABLED } from '../cacher';
import { notify } from '../index';
import { NotifyType } from '../solanaUtils';

export const DEPRECATED_MARKETS = [
  'EQ5XjC1neq4FbqLUaeHLx48CTougsPYdsGgti4KqEFUT',
  'dvQF6YNQvQ2dQkMyt3rW7ibypCkHJDgVAJvZz6A6gZx',
  'HngbFS7vMUeEm3JHYHJLwEuitdeKXv8oe27skwwsiYK',
];

const APP_MARKETS_URL = process.env.REACT_APP_MARKETS_URL;
const REGISTRAR_MARKET_URL = process.env.REACT_APP_REGISTRAR_MARKET_URL;

export const getMarketsFromOldCacher = async (): Promise<
  Array<{
    address: string;
    baseMint: string;
    programId: string;
  }>
> => {
  try {
    const res = await fetch(APP_MARKETS_URL);
    const { fraktionMarkets } = await res.json();
    return fraktionMarkets
      .map((market) => {
        return {
          address: market.ownAddress,
          baseMint: market.baseMint,
          programId: process.env.REACT_APP_SERUM_MARKET_PROGRAM_PUBKEY,
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
    return Cacher.getMarkets();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const getMarkets = IS_BFF_ENABLED
  ? getMarketsFromBFF
  : getMarketsFromOldCacher;

export const registerMarket = async (
  tickerName: string,
  marketPubkey: string,
  baseMint: string,
): Promise<boolean> => {
  try {
    const res = await fetch(REGISTRAR_MARKET_URL, {
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
        type: NotifyType.SUCCESS,
      });
    } else {
      notify({
        message: 'Market registration failed',
        type: NotifyType.ERROR,
      });
      return false;
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    notify({
      message: 'Market registration failed',
      type: NotifyType.ERROR,
    });
    return false;
  }
};
