import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import {
  FetchData,
  useInfinityScroll,
} from '../../../components/InfinityScroll/InfinityScroll';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: any[];
  loading: boolean;
  searchItems: any;
  setSearch: any;
  next: () => void;
  search: string;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [nftsLoading, setNftsLoading] = useState(true);

  const fetchData: FetchData = async ({ offset, limit, searchStr }) => {
    try {
      const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;
      const isSearch = searchStr ? `search=${searchStr}&` : '';

      const fullURL = `${URL}/Gu6faGp621MczGbkVtTppFNjJaoBSGQTM51NsQdJXLyR?${isSearch}skip=${offset}&limit=${limit}`;

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
  } = useInfinityScroll({
    fetchData,
  });

  const filteredNfts = useMemo(() => {
    return (userWhitelistedNFTs || []).sort(
      ({ name: nameA }, { name: nameB }) => nameA?.localeCompare(nameB),
    );
  }, [userWhitelistedNFTs]);

  const loading = nftsLoading && !filteredNfts.length;

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
