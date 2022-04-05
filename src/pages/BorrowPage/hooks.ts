import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import { useLazyUserTokens, UserNFT } from '../../contexts/userTokens';
import { EstimateNFT, useLoans } from '../../contexts/loans';
import { useWalletModal } from '../../contexts/WalletModal';
import { useWallet } from '@solana/wallet-adapter-react';

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
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const { nfts, fetchUserTokens, loading } = useLazyUserTokens();
  const { connected } = useWallet();

  const { setVisible } = useWalletModal();
  const { estimations } = useLoans();

  useEffect(() => {
    if (connected) {
      fetchUserTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts, loading, connected]);

  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();

  const rawNfts = nfts.reduce(
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
  };
};
