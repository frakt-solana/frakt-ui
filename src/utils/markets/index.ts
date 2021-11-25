import { notify } from '../index';

const REGISTRAR_URL = 'https://fraktion-tokens-register.herokuapp.com/market';
const MARKETS_URL =
  'https://raw.githubusercontent.com/frakt-solana/fraktion-tokens-list/main/markets.json';

export const getMarkets = async (): Promise<
  Array<{
    name: string;
    address: string;
    baseMint: string;
    programId: string;
  }>
> => {
  try {
    const res = await fetch(MARKETS_URL);
    const list = await res.json();
    return list;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

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