import classNames from 'classnames/bind';
import { Select } from 'antd';
import { FC, useRef, useState } from 'react';

import Button from '../../../../components/Button';
import {
  ArrowDownBtn,
  CloseModalIcon,
  QuestionIcon,
  SolanaIcon,
} from '../../../../icons';
import SettingsIcon from '../../../../icons/SettingsIcon';
import styles from './ModalParts.module.scss';

const { Option } = Select;

export interface ItemContentProps {
  name?: string;
  collectionName?: string;
  image?: string;
  onDeselect?: () => void;
  randomPoolImage?: string;
  className?: string;
}

export const ItemContent: FC<ItemContentProps> = ({
  name,
  image,
  collectionName,
  onDeselect,
  randomPoolImage,
  className,
}) => {
  return (
    <div className={classNames(styles.itemContent, className)}>
      <div className={styles.itemInfo}>
        {randomPoolImage ? (
          <div
            className={styles.questionImg}
            style={{ backgroundImage: `url(${randomPoolImage})` }}
          >
            <QuestionIcon
              className={styles.questionIcon}
              width={25}
              height={44}
            />
          </div>
        ) : (
          <div
            className={styles.itemImg}
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        <div className={styles.itemText}>
          <p className={styles.itemName}>{name}</p>
          {collectionName && (
            <p className={styles.itemCollection}>{collectionName}</p>
          )}
        </div>
        {onDeselect && (
          <div className={styles.itemDeselectWrapper} onClick={onDeselect}>
            <CloseModalIcon className={styles.itemDeselect} />
          </div>
        )}
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  onHeaderClick?: () => void;
  headerText: string;
  className?: string;
  setSlippage?: (nextValue: number) => void;
}

export const ModalHeader: FC<ModalHeaderProps> = ({
  onHeaderClick = () => {},
  headerText,
  className,
  setSlippage,
}) => {
  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  return (
    <div
      className={classNames(styles.itemHeader, className)}
      onClick={() => {
        if (isSlippageVisible) return;
        onHeaderClick();
      }}
    >
      <p className={styles.itemHeaderText}>{headerText}</p>

      {setSlippage && (
        <div
          className={classNames(styles.slippageWrapper, {
            [styles.slippageVisible]: isSlippageVisible,
          })}
        >
          <SettingsIcon
            onClick={(event) => {
              setIsSlippageVisible(true);
              event?.stopPropagation();
            }}
          />
          <div
            className={styles.slippageOverlay}
            onClick={() => setIsSlippageVisible(false)}
          />
          <div className={styles.slippageBlock}>
            <p className={styles.slippageTitle}>Slippage tolerance</p>
            <ul className={styles.slippageList}>
              <li className={styles.slippageItem}>1%</li>
              <li className={styles.slippageItem}>5%</li>
              <li className={styles.slippageItem}>10%</li>
              <li className={styles.slippageItem}>
                <input
                  type="text"
                  className={styles.slippageInput}
                  placeholder="0.0%"
                />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

interface SubmitButtonProps {
  className?: string;
  wrapperClassName?: string;
  onClick: () => void;
  text?: string;
  disabled?: boolean;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  onClick,
  className,
  wrapperClassName,
  text = 'Submit',
  disabled = false,
}) => {
  return (
    <div className={classNames(styles.btnWrapper, wrapperClassName)}>
      <Button
        type="alternative"
        className={classNames(styles.btn, className)}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </Button>
    </div>
  );
};

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

interface CurrencySelectorProps {
  className?: string;
  token: Token;
  setToken: (nextValue: Token) => void;
  price: string;
  label?: string;
  slippageText: string;
}

export const CurrencySelector: FC<CurrencySelectorProps> = ({
  className,
  token,
  setToken,
  price,
  label = 'Total',
  slippageText,
}) => {
  const settingsRef = useRef();

  return (
    <div className={classNames(styles.currencySelectorWrapper, className)}>
      <div className={classNames(styles.currencyWrapper, className)}>
        <p className={styles.totalText}>{label}</p>
        <p className={styles.totalAmount}>{price}</p>
        <div className={styles.separator} />
        <div className={styles.selectWrapper} ref={settingsRef}>
          <Select
            value={token}
            className={styles.select}
            suffixIcon={<ArrowDownBtn />}
            dropdownClassName={styles.dropdown}
            getPopupContainer={() => settingsRef.current}
            onChange={(nextValue) => setToken(nextValue)}
          >
            <Option value={Token.POOL_TOKEN} className={styles.option}>
              <div className={styles.tokenIcon} />
              <span className={styles.tokenText}>{`TOKEN`}</span>
            </Option>
            <Option value={Token.SOL} className={styles.option}>
              <SolanaIcon />
              <span className={styles.tokenText}>SOL</span>
            </Option>
          </Select>
        </div>
      </div>
      <p className={styles.slippageInfo}>{slippageText}</p>
    </div>
  );
};
