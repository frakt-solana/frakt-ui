import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserNFT, useUserTokens, BorrowNFT } from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../InfinityScroll';

export const useSelectLayout = (): {
  onDeselect: (nft?: BorrowNFT) => void;
  selectedNfts: BorrowNFT[];
  setSelectedNfts: Dispatch<SetStateAction<BorrowNFT[]>>;
  onMultiSelect: (nft: BorrowNFT) => void;
  onSelect: (nft: BorrowNFT) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
  connected: boolean;
} => {
  const { connected } = useWallet();
  const { nfts: rawNfts, nftsLoading: loading } = useUserTokens();

  const [selectedNfts, setSelectedNfts] = useState<BorrowNFT[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const onDeselect = (nft?: BorrowNFT): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onMultiSelect = (nft: BorrowNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onSelect = (nft: BorrowNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([nft]);
  };

  const nfts = useMemo(() => {
    return (rawNfts || []).filter(({ metadata }) =>
      metadata?.name?.toUpperCase()?.includes(searchString),
    );
  }, [searchString, rawNfts]);

  useEffect(() => {
    if (!connected && selectedNfts.length) {
      setSelectedNfts([]);
    }
  }, [connected, selectedNfts, setSelectedNfts]);

  return {
    onDeselect,
    selectedNfts,
    setSelectedNfts,
    onSelect,
    onMultiSelect,
    nfts,
    searchItems,
    loading,
    connected,
  };
};
