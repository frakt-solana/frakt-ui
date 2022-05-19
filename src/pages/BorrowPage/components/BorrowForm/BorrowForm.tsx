import { FC, useMemo } from 'react';
import { Dictionary } from 'lodash';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { ShortTermFields } from '../ShortTermFields';
import { useBorrowForm } from './hooks';
import {
  getFeePercent,
  getNftReturnPeriod,
  LoanData,
} from '../../../../contexts/loans';
import { getNftCreators, SOL_TOKEN } from '../../../../utils';

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
  const nftVerifiedCreators = getNftCreators(selectedNft);

  const valuation =
    Object.entries(priceByCreator)?.find(([creator]) =>
      nftVerifiedCreators.includes(creator),
    )?.[1] || 0;

  const ltv =
    Object.entries(ltvByCreator)?.find(([creator]) =>
      nftVerifiedCreators.includes(creator),
    )?.[1] || 0;

  const loanValue = (valuation / 10 ** SOL_TOKEN.decimals) * ltv || null;

  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
  } = useBorrowForm({
    onDeselect,
    proposedNftPrice: valuation,
  });

  const selectedNftName = selectedNft.metadata.name;

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

  const returnPeriod = useMemo(() => {
    if (loanData && selectedNft) {
      return getNftReturnPeriod({
        loanData,
        nft: selectedNft,
      });
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanData, selectedNft]);

  const feeWithDiscount = fee * (1 - interestRateDiscountPercent / 100);
  const returnPrice = loanValue + loanValue * feeWithDiscount;

  const SECONDS_PER_DAY = 24 * 60 * 60;

  const confirmText = `You are about to use ${selectedNftName} as collateral for an instant loan of ${returnPrice?.toFixed(
    3,
  )} SOL (incl. interest rate if applicable) that you commit to repay in full within ${(
    returnPeriod / SECONDS_PER_DAY
  ).toFixed(0)} days. Proceed?`;

  const submitButtonDisabled = !returnPrice || !ltv || !valuation;

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan info</p>
        <ShortTermFields
          valuation={valuation / 10 ** SOL_TOKEN.decimals}
          ltv={ltv}
          fee={fee}
          feeDiscountPercent={interestRateDiscountPercent}
          returnPeriodSeconds={returnPeriod}
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
