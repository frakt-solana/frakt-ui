import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserWhiteListedNFT } from '../../../contexts/userTokens';

export const useUserWhiteListedNFTs = (): {
  loading: boolean;
  userWhiteListedNFTs: UserWhiteListedNFT[];
} => {
  const { connected, publicKey } = useWallet();
  const [userWhiteListedNFTs, setUserWhiteListedNFTs] =
    useState<UserWhiteListedNFT[]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;

  let skip = 0;

  const fetchNftsUser = async (previousResponse = []): Promise<void> => {
    const limit = 10;

    try {
      const newResponse = await (
        await fetch(
          `${URL}/${publicKey?.toBase58()}?skip=${skip}&limit=${limit}`,
        )
      ).json();

      const response = [...previousResponse, ...newResponse];

      if (newResponse.length) {
        skip += limit;
        return fetchNftsUser(response);
      }

      setUserWhiteListedNFTs(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (connected) {
        await fetchNftsUser();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return {
    userWhiteListedNFTs,
    loading,
  };
};
