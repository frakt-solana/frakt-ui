import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import { useLazyUserTokens, UserNFT } from '../../contexts/userTokens';
import { EstimateNFT, useLoans } from '../../contexts/loans';
import { useWalletModal } from '../../contexts/WalletModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDebounce } from '../../hooks';
import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';

interface UserNFTWithEstimate extends UserNFT {
  estimate: EstimateNFT[];
}

export const useBorrowPage = (
  selectedNft?: UserNFT[],
): {
  currentVaultPubkey: string;
  isCloseSidebar: boolean;
  getPriceByMint: number;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  rawNfts: UserNFTWithEstimate[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const { nfts, fetchUserTokens, loading } = useLazyUserTokens();
  const { connected } = useWallet();
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [searchString, setSearchString] = useState<string>('');
  const { setVisible } = useWalletModal();
  const { estimations } = useLoans();

  useEffect(() => {
    if (connected) {
      fetchUserTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts, connected]);

  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredNfts = useMemo(() => {
    return nfts.filter(({ metadata }) =>
      metadata?.name.toUpperCase().includes(searchString),
    );
  }, [searchString, nfts]);

  const rawNfts = filteredNfts.reduce(
    (acc: UserNFTWithEstimate[], nft: UserNFT): UserNFTWithEstimate[] => {
      const nameNft = nft.metadata?.collection?.name;

      const filtered = estimations.filter(({ name }) => name === nameNft);
      if (filtered[0]?.id) {
        acc.push({ ...nft, estimate: filtered });
      }

      return acc;
    },
    [],
  );

  const getPriceByMint = useMemo(() => {
    if (rawNfts.length) {
      const selectedNftWithEstimation = rawNfts.filter(
        ({ mint }) => mint === selectedNft[0]?.mint,
      );
      return selectedNftWithEstimation[0]?.estimate[0]?.floorPrice;
    }
  }, [rawNfts, selectedNft]);

  return {
    currentVaultPubkey,
    isCloseSidebar,
    getPriceByMint,
    setIsCloseSidebar,
    rawNfts,
    setVisible,
    loading,
    searchItems,
  };
};
