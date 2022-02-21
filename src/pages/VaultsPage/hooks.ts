import { useEffect, useState } from 'react';

const FEATURED_VAULTS_ADDRESS = `https://raw.githubusercontent.com/frakt-solana/verified-mints/main/featured-vaults.json`;

export const useFeaturedVaultsPublicKeys = (): {
  featuredVaultsPublicKeys: string[];
} => {
  const [featuredVaultsPublicKeys, setFeaturedVaultsPublicKeys] = useState<
    string[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await (await fetch(FEATURED_VAULTS_ADDRESS)).json();

        if (result) setFeaturedVaultsPublicKeys(result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('githubusercontent api error: ', error);
      }
    })();
  }, []);

  return { featuredVaultsPublicKeys };
};
