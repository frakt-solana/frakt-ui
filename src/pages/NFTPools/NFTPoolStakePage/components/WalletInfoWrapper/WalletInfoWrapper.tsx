import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './WalletInfoWrapper.module.scss';

interface WalletInfoWrapperProps {
  children?: ReactNode;
  className?: string;
}

export const WalletInfoWrapper: FC<WalletInfoWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.walletInfoWrapper, className)}>
      {children}
    </div>
  );
};
