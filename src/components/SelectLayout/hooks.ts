import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../FakeInfinityScroll';

export const useSelectLayout = (): {
  onDeselect: (nft?: UserNFT) => void;
  selectedNfts: UserNFT[];
  setSelectedNfts: Dispatch<SetStateAction<UserNFT[]>>;
  onMultiSelect: (nft: UserNFT) => void;
  onSelect: (nft: UserNFT) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
} => {
  const { nfts: rawNfts, nftsLoading: loading } = useUserTokens();

  const [selectedNfts, setSelectedNfts] = useState<UserNFT[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const onDeselect = (nft?: UserNFT): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onMultiSelect = (nft: UserNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onSelect = (nft: UserNFT): void => {
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

  return {
    onDeselect,
    selectedNfts,
    setSelectedNfts,
    onSelect,
    onMultiSelect,
    nfts,
    searchItems,
    loading,
  };
};
