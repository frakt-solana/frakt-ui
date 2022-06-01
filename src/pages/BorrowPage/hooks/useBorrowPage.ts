import { useState, useMemo, Dispatch, SetStateAction } from 'react';

import { useFakeInfinityScroll } from '../../../components/FakeInfinityScroll';
import { UserWhitelistedNFT } from '../../../contexts/userTokens';
import { useUserWhitelistedNFTs } from './useUserWhitelistedNFTs';
import { useDebounce } from '../../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserWhitelistedNFT[];
  loading: boolean;
  searchItems: (search: string) => void;
  pagination: { skip: number; limit: number };
  fetchData: () => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);

  const { userWhitelistedNFTs, pagination, fetchData } =
    useUserWhitelistedNFTs();

  const searchItems = useDebounce((search: string): void => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return (userWhitelistedNFTs || [])
      .filter(({ name }) => name?.toUpperCase().includes(searchString))
      .sort(({ name: nameA }, { name: nameB }) => nameA?.localeCompare(nameB));
  }, [searchString, userWhitelistedNFTs]);

  const loading = !filteredNfts.length;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    loading,
    searchItems,
    pagination,
    fetchData,
  };
};
