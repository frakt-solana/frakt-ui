import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFakeInfinityScroll } from '../../../components/FakeInfinityScroll';
import { useWalletModal } from '../../../contexts/WalletModal';
import { WhiteListedNFT } from '../../../contexts/userTokens';
import { useWhitelistedNfts } from './useWhitelistedNfts';
import { useDebounce } from '../../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: WhiteListedNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const { setVisible } = useWalletModal();
  const { connected } = useWallet();

  const { whitelistedNfts, loading } = useWhitelistedNfts();

  const searchItems = useDebounce((search: string): void => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return (whitelistedNfts || [])
      .filter(({ name }) => name?.toUpperCase().includes(searchString))
      .sort(({ name: nameA }, { name: nameB }) => nameB?.localeCompare(nameA));
  }, [searchString, whitelistedNfts]);

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    setVisible,
    loading: connected ? loading : false,
    searchItems,
  };
};
