import { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { LoanWithNftData } from '../../utils/loans';
import styles from './LoanCard.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import { useCountdown } from '../../hooks';
import { useLoans } from '../../contexts/loans';

interface NFTCheckboxInterface {
  className?: string;
  imageUrl?: string;
  name?: string;
  ltvPrice?: number;
  onDetailsClick?: () => void;
  nft: LoanWithNftData;
}

const LoanCard: FC<NFTCheckboxInterface> = ({
  className,
  imageUrl,
  name,
  ltvPrice,
  nft,
}) => {
  const { getLoanBack } = useLoans();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onGetBackLoan = async (): Promise<void> => {
    openLoadingModal();
    await getLoanBack({ loan: nft });
    // await fetchLoansData(); //TODO: Optimistic here
    closeLoadingModal();
  };

  const { timeLeft, leftTimeInSeconds } = useCountdown(
    moment(nft.expiredAt).unix(),
  );

  const loanDurationInSeconds = nft.duration * 24 * 60 * 60;

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
                <p className={styles.ltvText}>{ltvPrice.toFixed(2)}</p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>To repay</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>
                  {(nft.return_amount - nft.amount).toFixed(3)}
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
