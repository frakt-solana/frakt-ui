import { FC, useEffect, useState } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import { Radio } from '../../../../components/Radio';
import LongTermFields from '../LongTermFields';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';
import { SOL_TOKEN } from '../../../../utils';
import { BorrowNft } from '../../../../state/loans/types';

interface BorrowFormProps {
  selectedNft: BorrowNft;
  onDeselect?: () => void;
}

enum FormFieldTypes {
  SHORT_TERM_FIELD = 'shortTermField',
  LONG_TERM_FIELD = 'longTermField',
}

const getConfirmModalText = (nft: BorrowNft, isPriceBased = false) => {
  const { name, timeBased } = nft;

  const confirmShortTermText = `You are about to use ${name} as collateral for an instant loan of ${timeBased.repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${timeBased.returnPeriodDays} days. Proceed?`;
  const confirmLongTermText = `long term text ...`;

  return isPriceBased ? confirmLongTermText : confirmShortTermText;
};

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
}) => {
  const { valuation, priceBased } = selectedNft;

  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  } = useBorrowForm({
    onDeselect,
    proposedNftPrice: parseFloat(valuation) * 10 ** SOL_TOKEN.decimals,
  });

  const [formFieldType, setFormFieldType] = useState<FormFieldTypes>(
    FormFieldTypes.LONG_TERM_FIELD,
  );

  useEffect(() => {
    if (!selectedNft?.priceBased) {
      setFormFieldType(FormFieldTypes.SHORT_TERM_FIELD);
    } else {
      setFormFieldType(FormFieldTypes.LONG_TERM_FIELD);
    }
  }, [selectedNft]);

  const confirmText = getConfirmModalText(
    selectedNft,
    formFieldType === FormFieldTypes.LONG_TERM_FIELD,
  );

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan info</p>
        <div className={styles.radioWrapper}>
          <Radio
            className={styles.radio}
            checked={formFieldType === FormFieldTypes.LONG_TERM_FIELD}
            disabled={!priceBased}
            onClick={() => setFormFieldType(FormFieldTypes.LONG_TERM_FIELD)}
            label="Long-term"
          />
          <Radio
            className={styles.radio}
            checked={formFieldType === FormFieldTypes.SHORT_TERM_FIELD}
            onClick={() => setFormFieldType(FormFieldTypes.SHORT_TERM_FIELD)}
            label="Short-term"
          />
        </div>
        {formFieldType === FormFieldTypes.SHORT_TERM_FIELD && (
          <ShortTermFields nft={selectedNft} />
        )}
        {formFieldType === FormFieldTypes.LONG_TERM_FIELD && !!priceBased && (
          <LongTermFields
            nft={selectedNft}
            // liquidationPrice={liquidationPrice}
            // loanValue={ultimateLoanValue}
            // valuation={valuation}
            // mintingFee={mintingFee}
            // ltvPercents={ltvPercents}
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
