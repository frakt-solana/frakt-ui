import classNames from 'classnames';
import { FC } from 'react';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './WalletInfo.module.scss';

export interface Action {
  label: string;
  action: () => void;
  btnPressedState?: boolean;
}

interface WalletInfoProps {
  title: string;
  balance: string;
  firstAction?: Action;
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
        {!!firstAction && (
          <WalletInfoButton
            className={classNames([
              styles.walletInfoBtn,
              { [styles.walletInfoBtnPressed]: firstAction?.btnPressedState },
            ])}
            onClick={firstAction.action}
          >
            {firstAction.label}
          </WalletInfoButton>
        )}
        {!!secondAction && (
          <WalletInfoButton
            className={classNames([
              styles.walletInfoBtn,
              { [styles.walletInfoBtnPressed]: secondAction?.btnPressedState },
            ])}
            onClick={secondAction.action}
          >
            {secondAction.label}
          </WalletInfoButton>
        )}
      </div>
    </WalletInfoWrapper>
  );
};
