import { FC } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { LoanWithNftData, getBack } from '../../utils/loans';
import { useLoans } from '../../contexts/loans';
import useRemainLoan from './useRemainLoan';
import styles from './LoanCard.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

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
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { fetchLoansData } = useLoans();

  const onGetBackLoan = async (): Promise<void> => {
    openLoadingModal();
    await getBack({ connection, wallet, loan: nft });
    await fetchLoansData();
    closeLoadingModal();
  };

  const timeLeft = useRemainLoan(nft.duration, nft.expiredAt);

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
              <p className={styles.ltvTitle}>LTV</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{ltvPrice.toFixed(2)}</p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>FEE</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>
                  {(nft.return_amount - nft.amount).toFixed(3)}
                </p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>RETURMENT</p>
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
                  style={{ width: `${timeLeft.width}%` }}
                />
              </div>
            </div>
            <Button
              type="alternative"
              className={styles.btn}
              onClick={onGetBackLoan}
            >
              Return
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
