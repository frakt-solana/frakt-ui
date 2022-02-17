import { useEffect, useState } from 'react';

export const useFeaturedVaultsPublicKeys = (): {
  featuredVaultsPubKeyList: string[];
} => {
  const [featuredVaultsPubKeyList, setFeaturedVaultsPubKeyList] = useState<
    string[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await (
          await fetch(
            `https://raw.githubusercontent.com/frakt-solana/verified-mints/main/featured-vaults.json`,
          )
        ).json();

        if (result) setFeaturedVaultsPubKeyList(result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('githubusercontent api error: ', error);
      }
    })();
  }, []);

  return { featuredVaultsPubKeyList };
};
