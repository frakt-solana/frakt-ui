import { FC } from 'react';

import styles from './ShortTermFields.module.scss';
import { SOL_TOKEN } from '../../../../utils';

export const ShortTermFields: FC = () => {
  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.valueField}>
        <p className={styles.valueFieldTitle}>LTV</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>10.00</p>
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
        <p className={styles.valueFieldTitle}>Repay value</p>
        <div className={styles.valueFieldValueContainer}>
          <p className={styles.valueFieldValue}>10.00</p>
          <img className={styles.valueFieldTokenIcon} src={SOL_TOKEN.logoURI} />
          <p>{SOL_TOKEN.symbol}</p>
        </div>
      </div>
    </div>
  );
};
