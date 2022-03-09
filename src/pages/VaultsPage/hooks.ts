import { useEffect, useState } from 'react';

const FEATURED_VAULTS_ADDRESS = process.env.FEATURED_VAULTS_BY_FRAKT_TEAM_URL;

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
