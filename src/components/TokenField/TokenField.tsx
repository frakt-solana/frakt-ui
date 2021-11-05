import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { ChevronDownIcon } from '../../icons';
import { SelectTokenModal } from '../SelectTokenModal';
import { Token } from '../../utils';
import NumericInput from '../NumericInput';

interface TokenFieldProps {
  tokensList?: Token[];
  onTokenChange?: (nextToken: Token) => void;
  currentToken: Token;
  value: string;
  onValueChange: (nextValue: string) => void;
  modalTitle?: string;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
  onUseMaxButtonClick?: () => void;
}

const TokenField = ({
  tokensList,
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  modalTitle,
  label,
  style,
  className,
  onUseMaxButtonClick,
}: TokenFieldProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div
      style={style}
      className={classNames([className, { [styles.root_focused]: isFocused }])}
    >
      {!!label && (
        <div className={styles.label}>
          {label}
          {/* <span>BALANCE: 0 {currentToken.symbol}</span> //TODO: display balance of selected token when wallet connected */}
        </div>
      )}
      <div
        className={classNames([styles.root, className])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <NumericInput
          value={value}
          onChange={onValueChange}
          placeholder="0.0"
          positiveOnly
          className={styles.valueInput}
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
            className={classNames(styles.selectTokenBtn, {
              [styles.disabledTokens]: !tokensList || !onTokenChange,
            })}
            onClick={() => tokensList && setIsModalOpen(true)}
          >
            <img
              className={styles.tokenLogo}
              src={currentToken.img}
              alt={currentToken.symbol}
            />
            <span>{currentToken.symbol}</span>
            <ChevronDownIcon className={styles.arrowDownIcon} />
          </button>
        </div>
        {!!tokensList && !!onTokenChange && (
          <SelectTokenModal
            title={modalTitle}
            visible={isModalOpen}
            tokensList={tokensList}
            onChange={onTokenChange}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TokenField;
