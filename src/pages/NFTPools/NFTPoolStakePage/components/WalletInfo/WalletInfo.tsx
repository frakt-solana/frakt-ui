import { FC } from 'react';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './WalletInfo.module.scss';

export interface Action {
  label: string;
  action: () => void;
}

interface WalletInfoProps {
  title: string;
  balance: string;
  firstAction: Action;
  secondAction?: Action;
  className?: string;
}

export const WalletInfo: FC<WalletInfoProps> = ({
  title,
  balance,
  firstAction,
  secondAction,
  className,
}) => {
  return (
    <WalletInfoWrapper className={className}>
      <WalletInfoBalance title={title} values={[balance]} />
      <div className={styles.walletInfoBtnWrapper}>
        <WalletInfoButton
          className={styles.walletInfoBtn}
          onClick={firstAction.action}
        >
          {firstAction.label}
        </WalletInfoButton>
        {secondAction && (
          <WalletInfoButton
            className={styles.walletInfoBtn}
            onClick={secondAction.action}
          >
            {secondAction.label}
          </WalletInfoButton>
        )}
      </div>
    </WalletInfoWrapper>
  );
};
