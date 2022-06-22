import { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useWallet } from '@solana/wallet-adapter-react';

import { LoadingModal, useLoadingModal } from '../LoadingModal';
import { paybackLoan as paybackLoanTx } from '../../utils/loans';
import styles from './LoanCard.module.scss';
import { useConnection, useCountdown } from '../../hooks';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import { Loan } from '../../state/loans/types';
import Tooltip from 'rc-tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface LoanCardProps {
  loan: Loan;
}

const usePaybackLoan = () => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const paybackLoan = async (loan: Loan) => {
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

const LoanCard: FC<LoanCardProps> = ({ loan }) => {
  const { paybackLoan, closeLoadingModal, loadingModalVisible } =
    usePaybackLoan();

  const { imageUrl, name } = loan;

  const onPayback = () => {
    paybackLoan(loan);
  };

  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
          />
          <div className={styles.content}>
            <p className={styles.title}>{name}</p>
            <LoanCardValues loan={loan} />
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

const LoanCardValues: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { loanValue, repayValue, isPriceBased } = loan;

  return (
    <div className={styles.valuesWrapper}>
      <div
        className={classNames(styles.valuesWrapperColumn, {
          [styles.valuesWrapperRow]: isPriceBased,
        })}
      >
        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Borrowed</p>
          <div className={styles.valueInfo}>
            <p>{loanValue.toFixed(2)}</p>
            <img className={styles.valueInfoSolImage} src={SOL_TOKEN.logoURI} />
            <p>{SOL_TOKEN.symbol}</p>
          </div>
        </div>

        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>To repay</p>
          <div className={styles.valueInfo}>
            <p>{repayValue.toFixed(2)}</p>
            <img className={styles.valueInfoSolImage} src={SOL_TOKEN.logoURI} />
            <p>{SOL_TOKEN.symbol}</p>
          </div>
        </div>
      </div>

      {isPriceBased && (
        <div className={styles.valueWrapper}>
          <p className={styles.valueTitle}>Borrow APY</p>
          <div className={styles.valueInfo}>
            <p>{repayValue.toFixed(2)} %</p>
          </div>
        </div>
      )}

      <div className={styles.valueWrapper}>
        {isPriceBased ? (
          <div className={styles.valueWithTooltip}>
            <p className={styles.valueTitle}>Valuation status</p>
            <Tooltip placement="bottom" overlay="hover" visible={false}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>
        ) : (
          <p className={styles.valueTitle}>Time to return</p>
        )}
        {isPriceBased ? <Health loan={loan} /> : <TimeToReturn loan={loan} />}
      </div>
    </div>
  );
};

const TimeToReturn: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { expiredAt, startedAt } = loan;

  const expiredAtUnix = moment(expiredAt).unix();
  const startedAtUnix = moment(startedAt).unix();

  const loanDurationInSeconds = expiredAtUnix - startedAtUnix;

  const { timeLeft, leftTimeInSeconds } = useCountdown(expiredAtUnix);

  const progress =
    ((loanDurationInSeconds - leftTimeInSeconds) / loanDurationInSeconds) * 100;

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <div className={styles.countdown}>
        <p className={styles.timeItem}>{timeLeft.days}d</p>
        <span className={styles.timeDelim}>:</span>
        <p className={styles.timeItem}>{timeLeft.hours}h</p>
        <span className={styles.timeDelim}>:</span>
        <p className={styles.timeItem}>{timeLeft.minutes}m</p>
        <span className={styles.timeDelim}>:</span>
        <p className={styles.timeItem}>{timeLeft.seconds}s</p>
      </div>
      <LoanHealthProgress healthPercent={progress} />
    </div>
  );
};

enum Risk {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

const getRisk = ({ health }: { health: number }): Risk => {
  if (health < 33.3) return Risk.High;
  if (health < 66.6) return Risk.Medium;
  return Risk.Low;
};

const Health: FC<{
  loan: Loan;
}> = ({ loan }) => {
  const { health: rawHealth = 0, liquidationPrice, valuation } = loan;
  const health = rawHealth > 100 ? 100 : rawHealth;

  const pxInFullHealthPersent = 220;
  const moveLabelByHealthPersent =
    pxInFullHealthPersent - (100 - health) * (pxInFullHealthPersent / 100);

  const risk = getRisk({ health });

  return (
    <div className={classNames(styles.valueInfo, styles.valueInfoHealth)}>
      <LoanHealthProgress healthPercent={100 - health} risk={risk} />
      <div
        className={classNames(styles.badge, {
          [styles.highLoanRisk]: risk === Risk.High,
          [styles.mediumLoanRisk]: risk === Risk.Medium,
          [styles.lowLoanRisk]: risk === Risk.Low,
        })}
        style={{ left: `${moveLabelByHealthPersent}px` }}
      >
        {health >= 100 && '>'}
        {valuation.toFixed(2)} SOL
      </div>
      <div className={styles.healthValueWrapper}>
        <p className={styles.healthValue}>{liquidationPrice} SOL</p>
        <p className={styles.healthValue}>{valuation} SOL</p>
      </div>
    </div>
  );
};

const LoanHealthProgress: FC<{
  healthPercent: number;
  risk?: string;
}> = ({ healthPercent = 0, risk }) => {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={classNames(styles.progress, {
          [styles.highLoanRisk]: risk === Risk.High,
          [styles.mediumLoanRisk]: risk === Risk.Medium,
          [styles.lowLoanRisk]: risk === Risk.Low,
        })}
        style={{ width: `${100 - healthPercent}%` }}
      />
    </div>
  );
};
