import { useState, useMemo, Dispatch, SetStateAction } from 'react';

import { useFakeInfinityScroll } from '../../../components/FakeInfinityScroll';
import { UserWhiteListedNFT } from '../../../contexts/userTokens';
import { useUserWhiteListedNFTs } from './useUserWhiteListedNFTs';
import { useWalletModal } from '../../../contexts/WalletModal';
import { useDebounce } from '../../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserWhiteListedNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const { setVisible } = useWalletModal();

  const { userWhiteListedNFTs, loading: userWhiteListedNFTsLoading } =
    useUserWhiteListedNFTs();

  const searchItems = useDebounce((search: string): void => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return (userWhiteListedNFTs || [])
      .filter(({ name }) => name?.toUpperCase().includes(searchString))
      .sort(({ name: nameA }, { name: nameB }) => nameB?.localeCompare(nameA));
  }, [searchString, userWhiteListedNFTs]);

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
