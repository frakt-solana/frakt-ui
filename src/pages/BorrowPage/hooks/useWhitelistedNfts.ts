import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { WhiteListedNFT } from '../../../contexts/userTokens';

export const useWhitelistedNfts = (): {
  loading: boolean;
  whitelistedNfts: WhiteListedNFT[];
} => {
  const wallet = useWallet();
  const [whitelistedNfts, setWhitelistedNfts] =
    useState<WhiteListedNFT[]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;

  let skip = 0;

  const fetchNftsUser = async (previousResponse = []): Promise<any> => {
    const limit = 10;

    try {
      return await (
        await fetch(
          `${URL}/${wallet?.publicKey?.toBase58()}?skip=${skip}&limit=${limit}`,
        )
      )
        .json()
        .then((newResponse) => {
          const response = [...previousResponse, ...newResponse];

          if (newResponse.length !== 0) {
            skip += limit;
            return fetchNftsUser(response);
          }

          setWhitelistedNfts(response);
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet.connected) {
        await fetchNftsUser();
      }
    })();
  }, [wallet.connected, fetchNftsUser]);

  return {
    whitelistedNfts,
    loading,
  };
};
