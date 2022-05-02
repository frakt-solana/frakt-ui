import { useState, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useWalletModal } from '../../contexts/WalletModal';
import { LoanData, useLoans, useLoansInitialFetch } from '../../contexts/loans';
import { useDebounce } from '../../hooks';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
  loanData: LoanData;
} => {
  //? Hardcoded util multiple loanPools not implemented
  const loanPoolPubkey = 'Hy7h6FSicyB9B3ZNGtEs64dKzQWk8TuNdG1fgX5ccWFW';

  useLoansInitialFetch();
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
  const { loanDataByPoolPublicKey, loading: loansLoading } = useLoans();

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

  const loanData = loanDataByPoolPublicKey.get(loanPoolPubkey);

  const whitelistedNfts = useMemo(() => {
    if (rawNfts?.length && loanDataByPoolPublicKey?.size) {
      const creators = loanData?.collectionsInfo?.map(({ creator }) => creator);

      return rawNfts?.filter(({ metadata }) => {
        const nftCreator =
          metadata?.properties?.creators?.find(({ verified }) => verified)
            ?.address || '';
        return creators.includes(nftCreator);
      });
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNfts, loanDataByPoolPublicKey?.size]);

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
    loading: connected ? loading : false,
    searchItems,
    loanData,
  };
};
