import { useState, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useWalletModal } from '../../contexts/WalletModal';
import { useLoans } from '../../contexts/loans';
import { useDebounce } from '../../hooks';

export const useBorrowPage = (
  selectedNft?: UserNFT[],
): {
  currentVaultPubkey: string;
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const { connected } = useWallet();
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const {
    nfts: rawNfts,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
    loading: userTokensLoading,
  } = useUserTokens();
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [searchString, setSearchString] = useState<string>('');
  const { setVisible } = useWalletModal();
  const { availableCollections } = useLoans();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !nftsLoading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, nftsLoading]);

  const { vaultPubkey: currentVaultPubkey } = useParams<{
    vaultPubkey: string;
  }>();

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return (rawNfts || []).filter(({ metadata }) =>
      metadata?.name.toUpperCase().includes(searchString),
    );
  }, [searchString, rawNfts]);

  const nfts = filteredNfts.reduce((acc, nft: UserNFT) => {
    const nftCreatorAddress = nft?.metadata?.properties?.creators[0]?.address;

    const filtered = availableCollections.filter(({ creator }) =>
      creator.includes(nftCreatorAddress),
    );

    if (filtered.length) acc.push({ ...nft });

    return acc;
  }, []);

  return {
    currentVaultPubkey,
    isCloseSidebar,
    setIsCloseSidebar,
    nfts,
    setVisible,
    loading: nftsLoading,
    searchItems,
  };
};
