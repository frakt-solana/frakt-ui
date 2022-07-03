import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserNFT } from '../../state/userTokens/types';
import { useDebounce } from '../../hooks';
import { selectUserTokensState } from '../../state/userTokens/selectors';
import { useFakeInfinityScroll } from '../InfinityScroll';
import { BorrowNft } from '../../state/loans/types';

export const useSelectLayout = (): {
  onDeselect: (nft?: BorrowNft) => void;
  selectedNfts: BorrowNft[];
  setSelectedNfts: Dispatch<SetStateAction<BorrowNft[]>>;
  onMultiSelect: (nft: BorrowNft) => void;
  onSelect: (nft: BorrowNft) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
  connected: boolean;
} => {
  const { connected } = useWallet();
  const { nfts: rawNfts, nftsLoading: loading } = useSelector(
    selectUserTokensState,
  );

  const [selectedNfts, setSelectedNfts] = useState<BorrowNft[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const onDeselect = (nft?: BorrowNft): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onMultiSelect = (nft: BorrowNft): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onSelect = (nft: BorrowNft): void => {
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
