import { notify } from '../../external/utils/notifications';

const REGISTRAR_URL = 'https://fraktion-tokens-register.herokuapp.com/list';

export const registerToken = async (
  tickerName: string,
  fractionalMint: string,
  logoURI: string,
  nftName: string,
  vaultPubkey: string,
): Promise<boolean> => {
  try {
    const res = await fetch(REGISTRAR_URL, {
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
        message: 'Token regitered successfully',
        description: 'Token registration can take up to an hour',
        type: 'success',
      });
    } else {
      notify({
        message: 'Token registration failed',
        type: 'error',
      });
      return false;
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    notify({
      message: 'Token registration failed',
      type: 'error',
    });
    return false;
  }
};
