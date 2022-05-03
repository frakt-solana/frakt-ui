import { FC, useMemo } from 'react';
import { Dictionary } from 'lodash';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { ShortTermFields } from '../ShortTermFields';
import { useBorrowForm } from './hooks';
import { getReturnPrice, LoanData } from '../../../../contexts/loans';
import { getNftCreator, SOL_TOKEN } from '../../../../utils';

interface BorrowFormProps {
  selectedNft?: UserNFT;
  priceByCreator?: Dictionary<number | null>;
  ltvByCreator?: Dictionary<number | null>;
  onDeselect?: () => void;
  loanData: LoanData;
  interestRateDiscountPercent?: number;
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  priceByCreator = {},
  ltvByCreator = {},
  loanData,
  onDeselect,
  interestRateDiscountPercent = 0,
}) => {
  const ltv = ltvByCreator[getNftCreator(selectedNft)] || null;

  const valuation = priceByCreator[getNftCreator(selectedNft)] || null;

  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  } = useBorrowForm({ onDeselect, proposedNftPrice: valuation });

  const selectedNftName = selectedNft.metadata.name;
  const loanPeriodDays = 7;

  const returnPrice = useMemo(() => {
    if (loanData && ltv && selectedNft) {
      return getReturnPrice({
        ltv: ltv / 10 ** SOL_TOKEN.decimals,
        loanData,
        nft: selectedNft,
        interestRateDiscountPercent,
      });
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanData, ltv, selectedNft]);

  const confirmText = `You are about to use your ${selectedNftName} as collateral in loan that you claim to return in ${loanPeriodDays} days and repay is ${returnPrice?.toFixed(
    3,
  )} SOL.\nWant to proceed?`;

  const submitButtonDisabled = !returnPrice || !ltv || !valuation;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan settings</p>
        <ShortTermFields
          valuation={valuation / 10 ** SOL_TOKEN.decimals || null}
          ltv={ltv / 10 ** SOL_TOKEN.decimals || null}
          returnPrice={returnPrice}
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
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};
