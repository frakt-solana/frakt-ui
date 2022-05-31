import { useState, useMemo, Dispatch, SetStateAction } from 'react';

import { useFakeInfinityScroll } from '../../../components/FakeInfinityScroll';
import { UserWhitelistedNFT } from '../../../contexts/userTokens';
import { useUserWhitelistedNFTs } from './useUserWhitelistedNFTs';
import { useWalletModal } from '../../../contexts/WalletModal';
import { useDebounce } from '../../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserWhitelistedNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const { setVisible } = useWalletModal();

  const { userWhitelistedNFTs, loading: userWhiteListedNFTsLoading } =
    useUserWhitelistedNFTs();

  const searchItems = useDebounce((search: string): void => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return (userWhitelistedNFTs || [])
      .filter(({ name }) => name?.toUpperCase().includes(searchString))
      .sort(({ name: nameA }, { name: nameB }) => nameB?.localeCompare(nameA));
  }, [searchString, userWhitelistedNFTs]);

  const loading = userWhiteListedNFTsLoading || !filteredNfts.length;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    setVisible,
    loading,
    searchItems,
  };
};
