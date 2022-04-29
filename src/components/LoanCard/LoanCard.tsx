import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { CollectionInfoView, LoanView } from '@frakters/nft-lending-v2';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { useLoans } from '../../contexts/loans';
import styles from './LoanCard.module.scss';
import { useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import {
  ArweaveMetadata,
  getArweaveMetadataByMint,
} from '../../utils/getArweaveMetadata';

interface LoanCardProps {
  className?: string;
  loan: LoanView;
}

export interface LoansWithMetadata extends LoanView {
  metadata: ArweaveMetadata[];
  collection: CollectionInfoView;
}

const LoanCard: FC<LoanCardProps> = ({ className, loan }) => {
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { paybackLoan, loansProgramAccounts } = useLoans();

  const { timeLeft, leftTimeInSeconds } = useCountdown(loan.expiredAt);
  const [loanWithData, setLoanWithData] = useState<LoansWithMetadata>();

  const onGetBackLoan = async (): Promise<void> => {
    openLoadingModal();
    await paybackLoan({ loan: loanWithData });

    closeLoadingModal();
  };

  useEffect(() => {
    (async () => {
      const metadata = await getArweaveMetadataByMint([loan.nftMint]);

      const collectionInfo = loansProgramAccounts?.collectionInfos.find(
        ({ collectionInfoPubkey }) => {
          return collectionInfoPubkey === loan.collectionInfo;
        },
      );

      const value = Object.values(metadata);
      setLoanWithData({ ...loan, metadata: value, collection: collectionInfo });
    })();
  }, [loan, loansProgramAccounts?.collectionInfos]);

  const loanDurationInSeconds = 7 * 24 * 60 * 60;
  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={classNames([styles.root, className])}>
          <div
            className={styles.root__image}
            style={{
              backgroundImage: `url(${loanWithData?.metadata[0].image})`,
            }}
          />
          <div className={styles.root__content}>
            <p className={styles.root__title}>
              {loanWithData?.metadata[0].name}
            </p>
            <div className={styles.ltvWrapper}>
              <p className={styles.ltvTitle}>Borrowed</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>
                  {loanWithData?.amountToGet / 1e9}
                </p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
              <p className={styles.ltvTitle}>To repay</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>
                  {loanWithData?.amountToReturn / 1e9}
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
