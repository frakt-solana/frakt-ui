import { notify } from '../index';
import { NotifyType } from '../solanaUtils';

const REGISTRAR_TOKEN_URL = process.env.REGISTRAR_TOKEN_URL;

export const registerToken = async (
  tickerName: string,
  fractionalMint: string,
  logoURI: string,
  nftName: string,
  vaultPubkey: string,
): Promise<boolean> => {
  try {
    const res = await fetch(REGISTRAR_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: tickerName,
        address: fractionalMint,
        logoURI: logoURI,
        decimals: 3,
        nftName: nftName,
        vaultPubkey,
      }),
    });

    const data = await res.json();

    if (data?.success) {
      notify({
        message: 'Token registered successfully',
        description: 'Token registration can take up to an hour',
        type: NotifyType.SUCCESS,
      });
    } else {
      notify({
        message: 'Token registration failed',
        type: NotifyType.ERROR,
      });
      return false;
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    notify({
      message: 'Token registration failed',
      type: NotifyType.ERROR,
    });
    return false;
  }
};
