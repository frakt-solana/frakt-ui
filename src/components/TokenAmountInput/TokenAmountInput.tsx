import classNames from 'classnames';
import { FC, useState } from 'react';

import NumericInput from '../NumericInput';
import styles from './TokenAmountInput.module.scss';

export interface TokenAmountInputProps {
  value: string;
  setValue: (nextValue: string) => void;
  tokenImage?: string;
  tokenTicker: string;
  error?: boolean;
  className?: string;
}

export const TokenAmountInput: FC<TokenAmountInputProps> = ({
  value,
  setValue,
  tokenTicker,
  tokenImage,
  error = false,
  className,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div
      className={classNames([
        styles.tokenAmountInput,
        { [styles.tokenAmountInputFocused]: focused },
        { [styles.tokenAmountInputError]: error },
        className,
      ])}
    >
      <NumericInput
        className={styles.input}
        value={value}
        onChange={setValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        positiveOnly
        placeholder="0"
      />
      <div className={styles.tokenInfo}>
        {!!tokenImage && (
          <div
            className={styles.tokenImage}
            style={{ backgroundImage: `url(${tokenImage})` }}
          />
        )}
        <p className={styles.tokenTicker}>{tokenTicker}</p>
      </div>
    </div>
  );
};
