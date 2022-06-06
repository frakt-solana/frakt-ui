import classNames from 'classnames';
import { FC } from 'react';

import styles from './WalletInfoBalance.module.scss';

export interface WalletInfoBalanceProps {
  title: string;
  values: string[];
  className?: string;
}

export const WalletInfoBalance: FC<WalletInfoBalanceProps> = ({
  title,
  values,
  className,
}) => {
  return (
    <div className={classNames(styles.walletInfoBalanceWrapper, className)}>
      <p className={styles.walletInfoBalanceTitle}>{title}</p>
      <div className={styles.walletInfoBalanceValuesWrapper}>
        {values.map((value, idx) => (
          <p key={idx} className={styles.walletInfoBalanceValue}>
            {value}
          </p>
        ))}
      </div>
    </div>
  );
};
