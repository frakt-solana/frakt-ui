import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  FetchData,
  useInfinityScroll,
} from '../../../components/InfinityScroll';
import { BorrowNFT } from './../../../state/userTokens/types';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: BorrowNFT[];
  loading: boolean;
  searchItems: (search: string) => void;
  setSearch: (searchStr: string) => void;
  next: () => void;
  search: string;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [nftsLoading, setNftsLoading] = useState<boolean>(true);
  const wallet = useWallet();

  const fetchData: FetchData<BorrowNFT> = async ({
    offset,
    limit,
    searchStr,
  }) => {
    try {
      const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;
      const isSearch = searchStr ? `search=${searchStr}&` : '';

      const fullURL = `${URL}/${wallet?.publicKey?.toBase58()}?${isSearch}skip=${offset}&limit=${limit}`;
      const response = await fetch(fullURL);
      const nfts = await response.json();

      return nfts || [];
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setNftsLoading(false);
    }
  };

  const {
    next,
    search,
    setSearch,
    items: userWhitelistedNFTs,
    nextDebounced: searchItems,
  } = useInfinityScroll(
    {
      fetchData,
    },
    [wallet],
  );

  const filteredNfts = useMemo(() => {
    return (userWhitelistedNFTs || []).sort(
      ({ name: nameA }, { name: nameB }) => nameA?.localeCompare(nameB),
    );
  }, [userWhitelistedNFTs]);

  const loading = nftsLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    loading,
    setSearch,
    next,
    searchItems,
    search,
  };
};
