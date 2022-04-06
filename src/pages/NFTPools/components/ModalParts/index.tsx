import classNames from 'classnames/bind';
import { Select } from 'antd';
import { FC, useRef, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import Button from '../../../../components/Button';
import { ArrowDownBtn, CloseModalIcon, SolanaIcon } from '../../../../icons';
import SettingsIcon from '../../../../icons/SettingsIcon';
import styles from './ModalParts.module.scss';
import NumericInput from '../../../../components/NumericInput';

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
          />
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

export interface SlippageDropdownProps {
  slippage: string;
  setSlippage: (nextValue: string) => void;
  isSlippageDropdpwnVisible: boolean;
  setIsSlippageDropdpwnVisible: (nextValue: boolean) => void;
  posRight?: boolean;
  className?: string;
}

export const SlippageDropdown: FC<SlippageDropdownProps> = ({
  slippage,
  setSlippage,
  isSlippageDropdpwnVisible,
  setIsSlippageDropdpwnVisible,
  posRight = false,
  className,
}) => {
  const [inputSlippageValue, setInputSlippageValue] = useState<string>('');

  const onItemClick = (nextValue: string) => () => {
    setSlippage(nextValue);
    setInputSlippageValue('');
  };

  const onInputBlur = () => {
    const inputSlippageValueNumber = Number(
      inputSlippageValue.replace('%', ''),
    );

    const isInputValueValid =
      !isNaN(inputSlippageValueNumber) &&
      inputSlippageValueNumber >= 0.1 &&
      inputSlippageValueNumber < 100;

    if (isInputValueValid) {
      setSlippage(inputSlippageValue.replace('%', ''));
      setInputSlippageValue(`${inputSlippageValue}%`);
    } else {
      setSlippage('0.5');
      setInputSlippageValue('');
    }
  };

  return (
    <div
      className={classNames(
        styles.slippageWrapper,
        {
          [styles.slippageVisible]: isSlippageDropdpwnVisible,
        },
        className,
      )}
    >
      <SettingsIcon
        onClick={(event) => {
          setIsSlippageDropdpwnVisible(true);
          event?.stopPropagation();
        }}
      />
      <div
        className={styles.slippageOverlay}
        onClick={() => setIsSlippageDropdpwnVisible(false)}
      />
      <div
        className={classNames(styles.slippageBlock, {
          [styles.slippageBlockRight]: posRight,
        })}
      >
        <p className={styles.slippageTitle}>Slippage tolerance</p>
        <ul className={styles.slippageList}>
          <li
            className={classNames(styles.slippageItem, {
              [styles.slippageItemActive]:
                slippage === '0.1' && !inputSlippageValue,
            })}
            onClick={onItemClick('0.1')}
          >
            0.1%
          </li>
          <li
            className={classNames(styles.slippageItem, {
              [styles.slippageItemActive]:
                slippage === '0.5' && !inputSlippageValue,
            })}
            onClick={onItemClick('0.5')}
          >
            0.5%
          </li>
          <li
            className={classNames(styles.slippageItem, {
              [styles.slippageItemActive]:
                slippage === '1' && !inputSlippageValue,
            })}
            onClick={onItemClick('1')}
          >
            1%
          </li>
          <li className={styles.slippageItem}>
            <NumericInput
              className={classNames(styles.slippageInput, {
                [styles.slippageInputActive]: inputSlippageValue,
              })}
              value={inputSlippageValue}
              onChange={setInputSlippageValue}
              onFocus={() => {
                setInputSlippageValue(inputSlippageValue.replace('%', ''));
              }}
              onBlur={onInputBlur}
              positiveOnly
              placeholder="0.0%"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  onHeaderClick?: () => void;
  headerText: string;
  className?: string;
  slippage: number;
  setSlippage: (nextValue: number) => void;
  showSlippageDropdown?: boolean;
}

export const ModalHeader: FC<ModalHeaderProps> = ({
  onHeaderClick = () => {},
  headerText,
  className,
  slippage,
  setSlippage,
  showSlippageDropdown = true,
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

      {showSlippageDropdown && (
        <SlippageDropdown
          slippage={slippage.toString()}
          setSlippage={(slippage) => setSlippage(parseFloat(slippage))}
          isSlippageDropdpwnVisible={isSlippageVisible}
          setIsSlippageDropdpwnVisible={setIsSlippageVisible}
        />
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
  poolTokenInfo: TokenInfo;
}

export const CurrencySelector: FC<CurrencySelectorProps> = ({
  className,
  token,
  setToken,
  price,
  label = 'Total',
  slippageText,
  poolTokenInfo,
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
              <div
                className={styles.tokenIcon}
                style={{
                  backgroundImage: `url(${poolTokenInfo?.logoURI})`,
                }}
              />
              <span className={styles.tokenText}>{poolTokenInfo?.symbol}</span>
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
