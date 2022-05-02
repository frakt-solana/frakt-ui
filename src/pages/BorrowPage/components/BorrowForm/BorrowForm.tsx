import { FC, useMemo } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { ShortTermFields } from '../ShortTermFields';
import { useBorrowForm } from './hooks';
import { getReturnPrice, LoanData } from '../../../../contexts/loans';

interface BorrowFormProps {
  selectedNft?: UserNFT;
  ltv?: number;
  valuation?: number;
  onCloseSidebar?: () => void;
  loanData: LoanData;
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  ltv = 0,
  valuation = 0,
  loanData,
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

  const returnPrice = useMemo(() => {
    if (loanData && ltv && selectedNft) {
      return getReturnPrice({ ltv, loanData, nft: selectedNft });
    }

    return 0;
  }, [loanData, ltv, selectedNft]);

  const confirmText = `You are about to use your ${selectedNftName} as collateral in loan that you claim to return in ${loanPeriodDays} days and repay is ${returnPrice?.toFixed(
    3,
  )} SOL.\nWant to proceed?`;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan settings</p>
        <ShortTermFields
          valuation={valuation}
          ltv={ltv}
          returnPrice={returnPrice}
        />
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
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};
