import { FC } from 'react';
import classNames from 'classnames';

import styles from './ShortTermFields.module.scss';
import { BorrowNft } from '../../../../state/loans/types';

interface ShortTermFields {
  nft: BorrowNft;
}

export const ShortTermFields: FC<ShortTermFields> = ({ nft }) => {
  const { valuation } = nft;

  const {
    returnPeriodDays,
    ltvPercents,
    fee,
    feeDiscountPercents,
    repayValue,
    loanValue,
  } = nft.timeBased;

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
        <p className={styles.staticValueTitle}>Loan to Value</p>
        <p className={styles.staticValueData}>{ltvPercents.toFixed(0)}%</p>
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

      {!!feeDiscountPercents && (
        <div className={styles.staticValue} style={{ marginBottom: 10 }}>
          <p className={styles.staticValueTitle}>Fee Discount</p>
          <p className={styles.staticValueData}>{feeDiscountPercents}%</p>
        </div>
      )}

      <div className={classNames(styles.staticValue, styles.staticValueAccent)}>
        <p className={styles.staticValueTitle}>Repay Value</p>
        <p className={styles.staticValueData}>{repayValue} SOL</p>
      </div>
    </div>
  );
};
