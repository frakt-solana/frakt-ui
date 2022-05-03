import { FC, useMemo } from 'react';
import { Dictionary } from 'lodash';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { ShortTermFields } from '../ShortTermFields';
import { useBorrowForm } from './hooks';
import { getFeePercent, LoanData } from '../../../../contexts/loans';
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
  const nftCreator = getNftCreator(selectedNft);

  const valuation =
    priceByCreator[nftCreator] / 10 ** SOL_TOKEN.decimals || null;
  const ltv = ltvByCreator[nftCreator] || null;
  const loanValue = valuation * ltv || null;

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

  const fee = useMemo(() => {
    if (loanData && selectedNft) {
      return getFeePercent({
        loanData,
        nft: selectedNft,
      });
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanData, selectedNft]);

  const feeWithDiscount = fee * (1 - interestRateDiscountPercent / 100);
  const returnPrice = loanValue + loanValue * feeWithDiscount;

  const confirmText = `You are about to use your ${selectedNftName} as collateral in loan that you claim to return in ${loanPeriodDays} days and repay is ${returnPrice?.toFixed(
    3,
  )} SOL.\nWant to proceed?`;

  const submitButtonDisabled = !returnPrice || !ltv || !valuation;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan info</p>
        <ShortTermFields
          valuation={valuation}
          ltv={ltv}
          fee={fee}
          feeDiscountPercent={interestRateDiscountPercent}
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
