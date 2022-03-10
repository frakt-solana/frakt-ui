import { notify } from '../index';
import { NotifyType } from '../solanaUtils';

export const DEPRECATED_MARKETS = [
  'EQ5XjC1neq4FbqLUaeHLx48CTougsPYdsGgti4KqEFUT',
  'dvQF6YNQvQ2dQkMyt3rW7ibypCkHJDgVAJvZz6A6gZx',
  'HngbFS7vMUeEm3JHYHJLwEuitdeKXv8oe27skwwsiYK',
];

const REGISTRAR_MARKET_URL = process.env.REGISTRAR_MARKET_URL;

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
