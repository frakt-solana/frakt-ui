import { FC } from 'react';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';
import { CollectionInfoView, LoanView } from '@frakters/nft-lending-v2';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import {
  LoanWithArweaveMetadata,
  useLoans,
  paybackLoan as paybackLoanTx,
  getLoanCollectionInfo,
  getAmountToReturnForPriceBasedLoan,
} from '../../contexts/loans';
import styles from './LoanCard.module.scss';
import { useConnection, useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface LoanCardProps {
  className?: string;
  loanWithArweaveMetadata: LoanWithArweaveMetadata;
  withGracePeriod?: boolean;
}

const usePaybackLoan = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const { removeLoanOptimistic } = useLoans();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const paybackLoan = async (
    loan: LoanView,
    collectionInfo: CollectionInfoView,
  ) => {
    try {
      openLoadingModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
        collectionInfo,
      });

      if (!result) {
        throw new Error('Loan failed');
      }

      removeLoanOptimistic(loan);
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

const LoanCard: FC<LoanCardProps> = ({
  className,
  loanWithArweaveMetadata,
  withGracePeriod,
}) => {
  const { loan, metadata } = loanWithArweaveMetadata;

  const { loanDataByPoolPublicKey } = useLoans();
  const collectionInfo = getLoanCollectionInfo(
    loanDataByPoolPublicKey.get(loan?.liquidityPool),
    loan.collectionInfo,
  );

  const { paybackLoan, closeLoadingModal, loadingModalVisible } =
    usePaybackLoan();

  const { timeLeft, leftTimeInSeconds } = useCountdown(loan.expiredAt);

  const loanDurationInSeconds = loan.expiredAt - loan.startedAt;
  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  const onPayback = () => {
    paybackLoan(loan, collectionInfo);
  };

  const amountToGet = loan?.amountToGet
    ? (loan?.amountToGet / 10 ** SOL_TOKEN.decimals).toFixed(2)
    : '';

  const amountToReturn =
    getAmountToReturnForPriceBasedLoan(loan)?.toFixed(2) || '';

  return (
    <>
      <div className={styles.wrapper}>
        <div className={classNames([styles.root, className])}>
          <div
            className={styles.root__image}
            style={{
              backgroundImage: `url(${metadata?.image})`,
            }}
          />
          <div className={styles.root__content}>
            <p className={styles.root__title}>{metadata?.name}</p>
            <div className={styles.ltvWrapper}>
              {!withGracePeriod ? (
                <>
                  <p className={styles.ltvTitle}>Borrowed</p>
                  <div className={styles.ltvContent}>
                    <p className={styles.ltvText}>{amountToGet}</p>
                    <div className={styles.tokenInfo}>
                      <img
                        className={styles.ltvImage}
                        src={SOL_TOKEN.logoURI}
                      />
                      <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                    </div>
                  </div>
                  <p className={styles.ltvTitle}>To repay</p>
                  <div className={styles.ltvContent}>
                    <p className={styles.ltvText}>{amountToReturn}</p>
                    <div className={styles.tokenInfo}>
                      <img
                        className={styles.ltvImage}
                        src={SOL_TOKEN.logoURI}
                      />
                      <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                    </div>
                  </div>
                  <p className={styles.ltvTitle}>Time to return</p>
                </>
              ) : (
                <>
                  <div className={styles.graceWrapper}>
                    <div>
                      <p className={styles.ltvTitle}>LTV</p>
                      <div className={styles.ltvContent}>
                        <p className={styles.ltvText}>{amountToGet}</p>
                        <div className={styles.tokenInfo}>
                          <img
                            className={styles.ltvImage}
                            src={SOL_TOKEN.logoURI}
                          />
                          <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={styles.ltvTitle}>Fee</p>
                      <div className={styles.ltvContent}>
                        <p className={styles.ltvText}>{amountToReturn}</p>
                        <div className={styles.tokenInfo}>
                          <img
                            className={styles.ltvImage}
                            src={SOL_TOKEN.logoURI}
                          />
                          <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tooltip}>
                    <p className={styles.ltvTitle}>Grace Period</p>
                    <Tooltip
                      placement="bottom"
                      trigger="hover"
                      overlay={`You have to repay the loan in 23h : 23m : 13s`}
                    >
                      <QuestionCircleOutlined className={styles.tooltipIcon} />
                    </Tooltip>
                  </div>
                </>
              )}

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
