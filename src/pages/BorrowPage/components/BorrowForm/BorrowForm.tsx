import { FC } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import { Radio } from '../../../../components/Radio';
import LongTermFields from '../LongTermFields';
import styles from './BorrowForm.module.scss';
import { FormFieldTypes, useBorrowForm } from './hooks';
import { BorrowNft } from '../../../../state/loans/types';

interface BorrowFormProps {
  selectedNft: BorrowNft;
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
    formField,
    setFormField,
    priceBasedLTV,
    setPriceBasedLTV,
    confirmText,
    priceBasedDisabled,
  } = useBorrowForm({
    onDeselect,
    selectedNft,
  });

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan Type</p>
        <div className={styles.radioWrapper}>
          <Radio
            className={styles.radio}
            checked={formField === FormFieldTypes.LONG_TERM_FIELD}
            disabled={priceBasedDisabled}
            onClick={() => setFormField(FormFieldTypes.LONG_TERM_FIELD)}
            label="Perpetual loan"
          />
          <Radio
            className={styles.radio}
            checked={formField === FormFieldTypes.SHORT_TERM_FIELD}
            onClick={() => setFormField(FormFieldTypes.SHORT_TERM_FIELD)}
            label="Flip loan"
          />
        </div>
        {formField === FormFieldTypes.SHORT_TERM_FIELD && (
          <ShortTermFields nft={selectedNft} />
        )}
        {formField === FormFieldTypes.LONG_TERM_FIELD &&
          !priceBasedDisabled && (
            <LongTermFields
              nft={selectedNft}
              ltv={priceBasedLTV}
              setLtv={setPriceBasedLTV}
            />
          )}
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
        title="Ready?"
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
