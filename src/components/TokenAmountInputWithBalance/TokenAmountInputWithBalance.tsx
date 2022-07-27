import { FC } from 'react';
import classNames from 'classnames';

import { TokenAmountInput, TokenAmountInputProps } from '../TokenAmountInput';
import styles from './TokenAmountInputWithBalance.module.scss';

export interface TokenAmountInputWithBalanceProps
  extends TokenAmountInputProps {
  balance?: string;
  customLabel?: string;
  tokenInputClassName?: string;
}

export const TokenAmountInputWithBalance: FC<
  TokenAmountInputWithBalanceProps
> = ({
  balance = '0',
  className,
  tokenInputClassName,
  setValue,
  customLabel,
  ...props
}) => {
  const onBalanceClick = () => setValue(balance);

  return (
    <div className={classNames(styles.tokenAmountInputWithBalance, className)}>
      <p className={styles.tokenAmountInputWithBalanceValue}>
        {customLabel || 'Balance:'}{' '}
        <span
          onClick={onBalanceClick}
          className={styles.tokenAmountInputWithBalanceBtn}
        >
          {balance}
        </span>
      </p>
      <TokenAmountInput
        className={tokenInputClassName}
        setValue={setValue}
        {...props}
      />
    </div>
  );
};
