import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import Button from '../../../../../components/Button';
import styles from './WalletInfoButton.module.scss';

interface WalletInfoButtonProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const WalletInfoButton: FC<WalletInfoButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <Button
      className={classNames(styles.walletInfoButton, className)}
      onClick={onClick}
      type="alternative"
    >
      {children}
    </Button>
  );
};
