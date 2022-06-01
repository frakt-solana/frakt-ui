import { useWallet } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { UserNFT, useUserTokens } from '../../../../contexts/userTokens';
import { proposeLoan } from '../../../../contexts/loans';
import { useConnection } from '../../../../hooks';

type UseBorrowForm = (props: {
  onDeselect?: () => void;
  proposedNftPrice?: number;
}) => {
  openConfirmModal: () => void;
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  onSubmit: (nft: UserNFT) => void;
};

export const useBorrowForm: UseBorrowForm = ({
  onDeselect,
  proposedNftPrice = 0,
}): {
  openConfirmModal;
  confirmModalVisible;
  closeConfirmModal;
  loadingModalVisible;
  closeLoadingModal;
  onSubmit;
} => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const { removeTokenOptimistic } = useUserTokens();

  const onSubmit = async (nft: UserNFT) => {
    try {
      openLoadingModal();

      const result = await proposeLoan({
        nftMint: nft?.mint,
        connection,
        wallet,
        proposedNftPrice,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      removeTokenOptimistic([nft.mint]);
      onDeselect?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeConfirmModal();
      closeLoadingModal();
    }
  };

  return {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  };
};
