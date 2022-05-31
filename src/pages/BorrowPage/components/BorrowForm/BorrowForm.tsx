import { FC } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserWhiteListedNFT } from '../../../../contexts/userTokens';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  selectedNft: UserWhiteListedNFT;
  onDeselect?: () => void;
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  } = useBorrowForm({
    onDeselect,
  });

  const {
    name,
    loanValue,
    valuation,
    returnPeriodDays,
    repayValue,
    ltvPercents,
    fee,
    feeDiscountPercents,
  } = selectedNft;

  const confirmText = `You are about to use ${name} as collateral for an instant loan of ${repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${returnPeriodDays} days. Proceed?`;

  const submitButtonDisabled = !repayValue || !ltvPercents || !valuation;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan info</p>
        <ShortTermFields
          repayValue={repayValue}
          loanValue={loanValue}
          valuation={valuation}
          ltv={ltvPercents}
          fee={fee}
          feeDiscountPercent={feeDiscountPercents}
          returnPeriodDays={returnPeriodDays}
        />
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={openConfirmModal}
          type="alternative"
          className={styles.continueBtn}
          disabled={submitButtonDisabled}
        >
          Borrow
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={() => onSubmit(selectedNft)}
        subtitle={confirmText}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};
