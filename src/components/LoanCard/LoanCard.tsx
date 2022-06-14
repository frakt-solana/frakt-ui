import { FC } from 'react';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { paybackLoan as paybackLoanTx } from '../../utils/loans';
import { LoanView } from '../../state/loans/types';
import styles from './LoanCard.module.scss';
import { useConnection, useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

interface LoanCardProps {
  className?: string;
  loan: LoanView;
}

const usePaybackLoan = () => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const paybackLoan = async (loan: LoanView) => {
    try {
      openLoadingModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
      });

      if (!result) {
        throw new Error('Loan failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    paybackLoan,
    closeLoadingModal,
    loadingModalVisible,
  };
};

const LoanCard: FC<LoanCardProps> = ({ className, loan }) => {
  const { paybackLoan, closeLoadingModal, loadingModalVisible } =
    usePaybackLoan();

  const { timeLeft, leftTimeInSeconds } = useCountdown(loan?.expiredAt);

  const loanDurationInSeconds = loan?.expiredAt - loan?.startedAt;
  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  const onPayback = () => {
    paybackLoan(loan);
  };

  const amountToGet = loan?.amountToGet
    ? (loan?.amountToGet / 10 ** SOL_TOKEN.decimals).toFixed(2)
    : '';

  return (
    <>
      <div className={styles.wrapper}>
        <div className={classNames([styles.root, className])}>
          <div
            className={styles.root__image}
            style={{
              backgroundImage: `url(${loan?.nftImageUrl})`,
            }}
          />
          <div className={styles.root__content}>
            <p className={styles.root__title}>{loan?.nftName}</p>
            <div className={styles.ltvWrapper}>
              <p className={styles.ltvTitle}>Borrowed</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{amountToGet}</p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>To repay</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>
                  {loan?.amountToRepay.toFixed(2)}
                </p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>Time to return</p>
              <div className={styles.countdown}>
                <p className={styles.timeItem}>{timeLeft.days}d</p>
                <span className={styles.timeDelim}>:</span>
                <p className={styles.timeItem}>{timeLeft.hours}h</p>
                <span className={styles.timeDelim}>:</span>
                <p className={styles.timeItem}>{timeLeft.minutes}m</p>
                <span className={styles.timeDelim}>:</span>
                <p className={styles.timeItem}>{timeLeft.seconds}s</p>
              </div>
              <div className={styles.timeProgressWrapper}>
                <div
                  className={styles.timeProgress}
                  style={{ width: `${100 - progress}%` }}
                />
              </div>
            </div>
            <Button
              type="alternative"
              className={styles.btn}
              onClick={onPayback}
            >
              Repay
            </Button>
          </div>
        </div>
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default LoanCard;
