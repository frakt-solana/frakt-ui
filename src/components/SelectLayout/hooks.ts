import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  UserNFT,
  useUserTokens,
  UserWhitelistedNFT,
} from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../InfinityScroll';

export const useSelectLayout = (): {
  onDeselect: (nft?: UserWhitelistedNFT) => void;
  selectedNfts: UserWhitelistedNFT[];
  setSelectedNfts: Dispatch<SetStateAction<UserWhitelistedNFT[]>>;
  onMultiSelect: (nft: UserWhitelistedNFT) => void;
  onSelect: (nft: UserWhitelistedNFT) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
  connected: boolean;
} => {
  const { connected } = useWallet();
  const { nfts: rawNfts, nftsLoading: loading } = useUserTokens();

  const [selectedNfts, setSelectedNfts] = useState<UserWhitelistedNFT[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const onDeselect = (nft?: UserWhitelistedNFT): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onMultiSelect = (nft: UserWhitelistedNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onSelect = (nft: UserWhitelistedNFT): void => {
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
