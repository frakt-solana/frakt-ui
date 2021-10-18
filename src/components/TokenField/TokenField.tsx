import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { ChevronDownIcon } from '../../icons';

interface TokenFieldProps {
  value: number;
  onChange: (nextValue: number) => void;
  onUseMaxButtonClick?: () => void;
  onSelectTokenClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  token?: { name: string; imageSrc?: string };
}

const TokenField = ({
  value,
  onChange,
  onUseMaxButtonClick,
  onSelectTokenClick,
  style = {},
  className = '',
  token = { name: '---' },
}: TokenFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>();

  const onClickHandler = () => {
    inputRef.current.focus();
  };

  const onValueChageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue =
      event.target.value === '' ? null : Number(event.target.value);

    if (value !== nextValue) {
      onChange(nextValue);
    }
  };

  return (
    <div
      className={classNames([
        styles.root,
        className,
        { [styles.root_focused]: isFocused },
      ])}
      style={style}
      onClick={onClickHandler}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        className={styles.valueInput}
        value={value || value === 0 ? value : ''}
        type="number"
        onChange={(event) => onValueChageHandler(event)}
        min="0"
        placeholder="0.0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
        <button className={styles.selectTokenBtn} onClick={onSelectTokenClick}>
          {token?.imageSrc ? (
            <img
              className={styles.tokenLogo}
              src={token.imageSrc}
              alt={token.name}
            />
          ) : (
            <div className={styles.noTokenImg} />
          )}
          <span>{token.name}</span>
          <ChevronDownIcon className={styles.arrowDownIcon} />
        </button>
      </div>
    </div>
  );
};

export default TokenField;
