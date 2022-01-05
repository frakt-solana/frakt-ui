import { TokenHoldersInfo } from './fraktionOwners.model';

export const fetchVaultTokenHolders = async (
  fractionMint: string,
  offset = 0,
  limit = 10,
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
  try {
    const vaultTokenHolders = await fetchVaultTokenHolders(fractionMint);

    return vaultTokenHolders ? vaultTokenHolders.total : 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return 0;
  }
};
