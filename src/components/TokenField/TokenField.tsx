import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { ChevronDownIcon } from '../../icons';
import { SelectTokenModal } from '../SelectTokenModal';
import { getTokenImageUrl, Token } from '../../utils';

export interface TokenFieldValue {
  amount: number;
  token: Token;
}

interface TokenFieldProps {
  value: TokenFieldValue;
  onChange: (nextValue: TokenFieldValue) => void;
  onUseMaxButtonClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

const TokenField = ({
  value,
  onChange,
  onUseMaxButtonClick,
  style = {},
  className = '',
  label,
}: TokenFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div
      style={style}
      className={classNames([className, { [styles.root_focused]: isFocused }])}
    >
      {label && (
        <div className={styles.label}>
          {label}
          <span>BALANCE: 0 {value.token.symbol}</span>
        </div>
      )}
      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input
          className={styles.valueInput}
          value={value.amount.toString()}
          onChange={(e) =>
            onChange({
              amount: Number.parseFloat(e.target.value),
              token: value.token,
            })
          }
          type="number"
          min="0"
          placeholder="0.0"
          ref={inputRef}
        />
        {!!onUseMaxButtonClick && (
          <div className={styles.useMaxBtnContainer}>
            <button className={styles.useMaxBtn} onClick={onUseMaxButtonClick}>
              Use max
            </button>
          </div>
        )}
        <div>
          <button
            className={styles.selectTokenBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <img
              className={styles.tokenLogo}
              src={getTokenImageUrl(value.token.mint)}
              alt={value.token.symbol}
            />
            <span>{value.token.symbol}</span>
            <ChevronDownIcon className={styles.arrowDownIcon} />
          </button>
        </div>
        <SelectTokenModal
          title={label}
          visible={isModalOpen}
          onChange={(token) =>
            onChange({
              amount: value.amount,
              token,
            })
          }
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default TokenField;
