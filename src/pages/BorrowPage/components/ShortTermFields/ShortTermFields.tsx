import { FC } from 'react';

import styles from './ShortTermFields.module.scss';
import { SOL_TOKEN } from '../../../../utils';

interface ShortTermFields {
  ltv?: number;
  valuation?: number;
  returnPrice?: number;
}

export const ShortTermFields: FC<ShortTermFields> = ({
  ltv = 0,
  valuation = 0,
  returnPrice = 0,
}) => {
  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.valueField}>
        <p className={styles.valueFieldTitle}>Valuation</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>{valuation?.toFixed(3)}</p>
          <img className={styles.valueFieldTokenIcon} src={SOL_TOKEN.logoURI} />
          <p>{SOL_TOKEN.symbol}</p>
        </div>
      </div>

      <div className={styles.valueField}>
        <p className={styles.valueFieldTitle}>Return period</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>7 Days</p>
        </div>
      </div>

      <div className={styles.valueField}>
        <p className={styles.valueFieldTitle}>LTV</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>{ltv?.toFixed(3)}</p>
          <img className={styles.valueFieldTokenIcon} src={SOL_TOKEN.logoURI} />
          <p>{SOL_TOKEN.symbol}</p>
        </div>
      </div>

      <div className={styles.valueField}>
        <p className={styles.valueFieldTitle}>Repay value</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>{returnPrice?.toFixed(3)}</p>
          <img className={styles.valueFieldTokenIcon} src={SOL_TOKEN.logoURI} />
          <p>{SOL_TOKEN.symbol}</p>
        </div>
      </div>
    </div>
  );
};
