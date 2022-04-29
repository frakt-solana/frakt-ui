import { useState, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useWalletModal } from '../../contexts/WalletModal';
import { useLoans } from '../../contexts/loans';
import { useDebounce, usePublicKeyParam } from '../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const { loanPoolPubkey } = useParams<{ loanPoolPubkey: string }>();
  usePublicKeyParam(loanPoolPubkey);

  const { connected } = useWallet();
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const {
    nfts: rawNfts,
    loading: userTokensLoading,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [searchString, setSearchString] = useState<string>('');
  const { setVisible } = useWalletModal();
  const { availableCollections, loading: loansLoading } = useLoans();

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

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const whitelistedNfts = useMemo(() => {
    if (rawNfts?.length && availableCollections?.length) {
      const availableCollection = availableCollections?.find(
        ({ loan_pool }) => loan_pool === loanPoolPubkey,
      );

      const creator = availableCollection.creator;

      return rawNfts?.filter(({ metadata }) => {
        const nftCreator =
          metadata?.properties?.creators?.find(({ verified }) => verified)
            ?.address || '';
        return nftCreator === creator;
      });
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNfts, availableCollections]);

  const filteredNfts = useMemo(() => {
    return (whitelistedNfts || []).filter(({ metadata }) =>
      metadata?.name.toUpperCase().includes(searchString),
    );
  }, [searchString, whitelistedNfts]);

  const loading = userTokensLoading || nftsLoading || loansLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    setVisible,
    loading,
    searchItems,
  };
};
