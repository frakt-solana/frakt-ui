import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../FakeInfinityScroll';

export const useSelectLayout = (): {
  onDeselect: (nft: UserNFT) => void;
  onDeselectOneNft: (nft: UserNFT) => void;
  selectedNfts: UserNFT[];
  setSelectedNfts: Dispatch<SetStateAction<UserNFT[]>>;
  onCardClick: (nft: UserNFT) => void;
  onSelectOneNft: (nft: UserNFT) => void;
  nfts: UserNFT[];
  searchItems: (search: string) => void;
  loading: boolean;
  activeTokenAddress: string;
  selectedNft: UserNFT[];
} => {
  const { connected } = useWallet();
  const {
    nfts: rawNfts,
    loading: userTokensLoading,
    nftsLoading: loading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();

  const [selectedNfts, setSelectedNfts] = useState<UserNFT[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [activeTokenAddress, setActiveTokenAddress] = useState<string | null>();
  const [selectedNft, setSelectedNft] = useState<UserNFT[]>([]);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !loading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, loading]);

  const onDeselect = (nft: UserNFT): void => {
    setSelectedNfts(
      selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
    );
  };

  const onDeselectOneNft = (nft: UserNFT): void => {
    setSelectedNft(
      selectedNft.filter((selectedNft) => selectedNft?.mint !== nft.mint),
    );
  };

  const onCardClick = (nft: UserNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onSelectOneNft = (nft: UserNFT): void => {
    if (nft.mint === activeTokenAddress) {
      setActiveTokenAddress(null);
      setSelectedNft([]);
    } else {
      setActiveTokenAddress(nft.mint);
      setSelectedNft([nft]);
    }
  };

  const nfts = useMemo(() => {
    return rawNfts.filter(({ metadata }) =>
      metadata?.name.toUpperCase().includes(searchString),
    );
  }, [searchString, rawNfts]);

  return {
    onDeselect,
    selectedNfts,
    setSelectedNfts,
    onCardClick,
    nfts,
    searchItems,
    loading,
    onSelectOneNft,
    activeTokenAddress,
    selectedNft,
    onDeselectOneNft,
  };
};
