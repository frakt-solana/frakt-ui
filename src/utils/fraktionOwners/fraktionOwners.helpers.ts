import { TokenHoldersInfo } from './fraktionOwners.model';

export const fetchVaultTokenHolders = async (
  fractionMint: string,
  offset = 0,
  limit = 20,
): Promise<TokenHoldersInfo | null> => {
  try {
    const data = await (
      await fetch(
        `https://public-api.solscan.io/token/holders?tokenAddress=${fractionMint}&offset=${offset}&limit=${limit}`,
      )
    ).json();

    return data ? (data as TokenHoldersInfo) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
};

export const fetchVaultTokenHoldersAmount = async (
  fractionMint: string,
): Promise<number> => {
  const LIMIT = 20;

  try {
    const vaultTokenHolders = await fetchVaultTokenHolders(
      fractionMint,
      0,
      LIMIT,
    );

    //? SHIT because an error in solscan api
    if (vaultTokenHolders) {
      return vaultTokenHolders.data.length < LIMIT
        ? vaultTokenHolders.data.length
        : vaultTokenHolders.total;
    }

    return 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return 0;
  }
};
