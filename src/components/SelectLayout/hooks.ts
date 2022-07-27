import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { BorrowNft } from '../../state/loans/types';

export const useSelectLayout = (): {
  connected: boolean;
  onSelect: (nft: BorrowNft) => void;
  selectedNfts: BorrowNft[];
  onDeselect: (nft?: BorrowNft) => void;
} => {
  const { connected } = useWallet();
  const [selectedNfts, setSelectedNfts] = useState<BorrowNft[]>([]);

  const onDeselect = (nft?: BorrowNft): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onSelect = (nft: BorrowNft): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([nft]);
  };

  useEffect(() => {
    if (!connected && selectedNfts.length) {
      setSelectedNfts([]);
    }
  }, [connected, selectedNfts, setSelectedNfts]);

  return {
    connected,
    onSelect,
    onDeselect,
    selectedNfts,
  };
};
