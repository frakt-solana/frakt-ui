import { FC } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { UserWhiteListedNFT } from '../../../../contexts/userTokens';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';
import { useStakingPoints } from '../../hooks/useStakingPoints';
import { useWallet } from '@solana/wallet-adapter-react';

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

  const { publicKey } = useWallet();
  const { stakingPoints } = useStakingPoints(publicKey);

  const confirmText = `You are about to use ${name} as collateral for an instant loan of ${repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${returnPeriodDays} days. Proceed?`;

  const submitButtonDisabled = !repayValue || !ltvPercents || !valuation;

  const feeDiscountPercentsWithStakingPoints =
    Number(feeDiscountPercents) + stakingPoints;

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
          feeDiscountPercent={feeDiscountPercentsWithStakingPoints}
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
