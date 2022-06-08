import { FC } from 'react';

import styles from './ShortTermFields.module.scss';
import classNames from 'classnames';

interface ShortTermFields {
  repayValue?: string;
  loanValue?: string;
  valuation?: string;
  ltv?: number;
  fee?: string;
  feeDiscountPercent?: number;
  returnPeriodDays?: number;
}

export const ShortTermFields: FC<ShortTermFields> = ({
  loanValue,
  valuation,
  ltv,
  fee,
  feeDiscountPercent,
  returnPeriodDays,
  repayValue,
}) => {
  return (
    <div className={styles.fieldWrapper}>
      <div
        className={styles.staticValue}
        style={{ marginBottom: 10, paddingTop: 20 }}
      >
        <p className={styles.staticValueTitle}>Valuation</p>
        <p className={styles.staticValueData}>{valuation} SOL</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Return period</p>
        <p className={styles.staticValueData}>{returnPeriodDays} Days</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>LTV</p>
        <p className={styles.staticValueData}>{ltv.toFixed(0)}%</p>
      </div>

      <div
        className={classNames(styles.staticValue, styles.staticValueAccent)}
        style={{ marginBottom: 30 }}
      >
        <p className={styles.staticValueTitle}>Loan value</p>
        <p className={styles.staticValueData}>{loanValue} SOL</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Fee</p>
        <p className={styles.staticValueData}>{fee} SOL</p>
      </div>

      {!!feeDiscountPercent && (
        <div className={styles.staticValue} style={{ marginBottom: 10 }}>
          <p className={styles.staticValueTitle}>Fee Discount</p>
          <p className={styles.staticValueData}>{feeDiscountPercent}%</p>
        </div>
      )}

      <div className={classNames(styles.staticValue, styles.staticValueAccent)}>
        <p className={styles.staticValueTitle}>Repay Value</p>
        <p className={styles.staticValueData}>{repayValue} SOL</p>
      </div>
    </div>
  );
};
