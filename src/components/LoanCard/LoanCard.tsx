import { FC } from 'react';
import classNames from 'classnames';
import { LoanView } from '@frakters/nft-lending-v2';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { useLoans } from '../../contexts/loans';
import styles from './LoanCard.module.scss';
import { useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

interface NFTCheckboxInterface {
  className?: string;
  imageUrl?: string;
  name?: string;
  ltvPrice?: number;
  onDetailsClick?: () => void;
  loan: LoanView;
}

const LoanCard: FC<NFTCheckboxInterface> = ({
  className,
  imageUrl,
  name,
  loan,
}) => {
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { paybackLoan, loansProgramAccounts } = useLoans();

  const onGetBackLoan = async (): Promise<void> => {
    openLoadingModal();
    await paybackLoan({
      loan,
      royaltyAddress: loansProgramAccounts.collectionInfo[0].royaltyAddress,
    });

    closeLoadingModal();
  };

  const { timeLeft, leftTimeInSeconds } = useCountdown(loan.expiredAt);

  const loanDurationInSeconds = 7 * 24 * 60 * 60;
  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={classNames([styles.root, className])}>
          <div
            className={styles.root__image}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className={styles.root__content}>
            <p className={styles.root__title}>{name}</p>
            <div className={styles.ltvWrapper}>
              <p className={styles.ltvTitle}>Borrowed</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{loan?.amountToGet / 1e9}</p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>To repay</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{loan?.amountToReturn / 1e9}</p>
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
              onClick={onGetBackLoan}
            >
              Repay
            </Button>
          </div>
        </div>
      </div>
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default LoanCard;
