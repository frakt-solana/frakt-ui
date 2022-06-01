import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserWhitelistedNFT } from '../../../contexts/userTokens';

export const useUserWhitelistedNFTs = (): {
  userWhitelistedNFTs: UserWhitelistedNFT[];
  pagination: { skip: number; limit: number };
  fetchData: () => void;
} => {
  const ITEMS_PER_PAGE = 10;
  const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;

  const [userWhitelistedNFTs, setUserWhitelistedNFTs] = useState<
    UserWhitelistedNFT[]
  >([]);

  const { publicKey } = useWallet();

  const [pagination, setPagination] = useState({
    skip: 0,
    limit: ITEMS_PER_PAGE,
  });

  const fetchData = async () => {
    const fullURL = `${URL}/${publicKey?.toBase58()}?skip=${
      pagination.skip
    }&limit=${pagination.limit}`;

    const response = await fetch(fullURL);
    const nfts = await response.json();

    if (nfts) {
      setUserWhitelistedNFTs([...userWhitelistedNFTs, ...nfts]);

      setPagination({
        ...pagination,
        skip: pagination.skip + ITEMS_PER_PAGE,
      });
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [publicKey]);

  return {
    pagination,
    fetchData,
    userWhitelistedNFTs,
  };
};
