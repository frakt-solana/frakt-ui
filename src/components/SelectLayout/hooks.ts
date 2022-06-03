import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserNFT } from '../../state/userTokens/types';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../FakeInfinityScroll';
import { selectUserTokensState } from '../../state/userTokens/selectors';

export const useSelectLayout = (): {
  onDeselect: (nft?: UserNFT) => void;
  selectedNfts: UserNFT[];
  setSelectedNfts: Dispatch<SetStateAction<UserNFT[]>>;
  onMultiSelect: (nft: UserNFT) => void;
  onSelect: (nft: UserNFT) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
  connected: boolean;
} => {
  const { connected } = useWallet();
  const { nfts: rawNfts, nftsLoading: loading } = useSelector(
    selectUserTokensState,
  );

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
