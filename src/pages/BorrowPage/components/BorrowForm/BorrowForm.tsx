import { FC } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { ShortTermFields } from '../ShortTermFields';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  selectedNft?: UserNFT;
  ltvPrice?: number;
  onCloseSidebar?: () => void;
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  ltvPrice = 0,
  onCloseSidebar,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  } = useBorrowForm({ onCloseSidebar });

  const selectedNftName = selectedNft.metadata.name;
  const loanPeriodDays = 7;

  const confirmText = `You are about to use your ${selectedNftName} as collateral in loan that you claim to return in ${loanPeriodDays} days and repay is ${ltvPrice?.toFixed(
    2,
  )} SOL.\nWant to proceed?`;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan settings</p>
        <ShortTermFields />
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={openConfirmModal}
          type="alternative"
          className={styles.continueBtn}
        >
          Borrow
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={() => onSubmit(selectedNft)}
        subtitle={confirmText}
      />
      <LoadingModal
        subtitle="In order to transfer the NFT/s approval is needed."
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        className={styles.modal}
      />
    </>
  );
};
