import { FC } from 'react';

import styles from './ShortTermFields.module.scss';
import classNames from 'classnames';

const SECONDS_PER_DAY = 24 * 60 * 60;

interface ShortTermFields {
  valuation?: number;
  ltv?: number;
  fee?: number;
  feeDiscountPercent?: number;
  returnPeriodSeconds?: number;
}

export const ShortTermFields: FC<ShortTermFields> = ({
  valuation = 0,
  ltv = 0,
  fee = 0,
  feeDiscountPercent = 0,
  returnPeriodSeconds = 7 * SECONDS_PER_DAY,
}) => {
  const loanValue = valuation * ltv || 0;

  const feeAmount = loanValue * fee || 0;

  const feeWithDiscount = fee * (1 - feeDiscountPercent / 100);

  const returnPrice = loanValue + loanValue * feeWithDiscount;

  const returnPeriodDays = (returnPeriodSeconds / SECONDS_PER_DAY).toFixed(0);

  return (
    <div className={styles.fieldWrapper}>
      <div
        className={styles.staticValue}
        style={{ marginBottom: 10, paddingTop: 20 }}
      >
        <p className={styles.staticValueTitle}>Valuation</p>
        <p className={styles.staticValueData}>{valuation?.toFixed(3)} SOL</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Return period</p>
        <p className={styles.staticValueData}>{returnPeriodDays} Days</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>LTV</p>
        <p className={styles.staticValueData}>{(ltv * 100).toFixed(0)}%</p>
      </div>

      <div
        className={classNames(styles.staticValue, styles.staticValueAccent)}
        style={{ marginBottom: 30 }}
      >
        <p className={styles.staticValueTitle}>Loan value</p>
        <p className={styles.staticValueData}>{loanValue?.toFixed(3)} SOL</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Fee</p>
        <p className={styles.staticValueData}>{feeAmount?.toFixed(3)} SOL</p>
      </div>

      {!!feeDiscountPercent && (
        <div className={styles.staticValue} style={{ marginBottom: 10 }}>
          <p className={styles.staticValueTitle}>Fee Discount</p>
          <p className={styles.staticValueData}>
            {feeDiscountPercent?.toFixed(0)}%
          </p>
        </div>
      )}

      <div className={classNames(styles.staticValue, styles.staticValueAccent)}>
        <p className={styles.staticValueTitle}>Repay Value</p>
        <p className={styles.staticValueData}>{returnPrice?.toFixed(3)} SOL</p>
      </div>
    </div>
  );
};
