import { FC, useState } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { BorrowNFT } from '../../../../state/userTokens/types';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import { Radio } from '../../../../components/Radio';
import LongTermFields from '../LongTermFields';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';
import { SOL_TOKEN } from '../../../../utils';

interface BorrowFormProps {
  selectedNft: BorrowNFT;
  onDeselect?: () => void;
}

enum FormFieldTypes {
  SHORT_TERM_FIELD = 'shortTermField',
  LONG_TERM_FIELD = 'longTermField',
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
}) => {
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

  const confirmShortTermText = `You are about to use ${name} as collateral for an instant loan of ${repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${returnPeriodDays} days. Proceed?`;
  const confirmLongTermText = `long term text ...`;

  const confirmText =
    formFieldType === FormFieldTypes.SHORT_TERM_FIELD
      ? confirmShortTermText
      : confirmLongTermText;

  const submitButtonDisabled = !repayValue || !ltvPercents || !valuation;

  const feeDiscountPercentsWithStakingPoints = Number(feeDiscountPercents);

  const ltvValue = ltvPercents / 100;

  const mintingFee = (Number(valuation) * ltvValue) / 100;
  const ultimateLoanValue = Number(valuation) * ltvValue - mintingFee;
  const liquidationPrice = Number(valuation) * ltvValue;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan info</p>
        <div className={styles.radioWrapper}>
          <Radio
            className={styles.radio}
            checked={formFieldType === FormFieldTypes.LONG_TERM_FIELD}
            onClick={() => setFormFieldType(FormFieldTypes.LONG_TERM_FIELD)}
            label={'Long-term'}
          />
          <Radio
            className={styles.radio}
            checked={formFieldType === FormFieldTypes.SHORT_TERM_FIELD}
            onClick={() => setFormFieldType(FormFieldTypes.SHORT_TERM_FIELD)}
            label={'Short-term'}
          />
        </div>
        {formFieldType === FormFieldTypes.SHORT_TERM_FIELD && (
          <ShortTermFields
            repayValue={repayValue}
            loanValue={loanValue}
            valuation={valuation}
            ltv={ltvPercents}
            fee={fee}
            feeDiscountPercent={feeDiscountPercentsWithStakingPoints}
            returnPeriodDays={returnPeriodDays}
          />
        )}
        {formFieldType === FormFieldTypes.LONG_TERM_FIELD && (
          <LongTermFields
            liquidationPrice={liquidationPrice}
            loanValue={ultimateLoanValue}
            valuation={valuation}
            mintingFee={mintingFee}
            ltvPercents={ltvPercents}
          />
        )}
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
