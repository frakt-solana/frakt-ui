import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import SettingsIcon from '../../../../icons/SettingsIcon';
import { ArrowDownBtn, CloseModalIcon, SolanaIcon } from '../../../../icons';
import classNames from 'classnames';
import { Select } from 'antd';

const { Option } = Select;
const tempImage =
  'https://www.arweave.net/xW93zrDmljTvqDiEQdJ5PuMq4CVL5Rz1vAjUO4TznD8';

export const BuyingModal: FC = () => {
  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  const settingsRef = useRef();

  const toggleSlippageModal = () => setIsSlippageVisible(!isSlippageVisible);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>
          You&apos;re buying<span>{2}</span>
        </p>
        <div
          className={classNames({
            [styles.slippageWrapper]: true,
            [styles.slippageVisible]: isSlippageVisible,
          })}
        >
          <SettingsIcon onClick={toggleSlippageModal} />
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
      </div>
      <ul className={styles.selectedList}>
        <li className={styles.selectedItem}>
          <div
            className={styles.itemImg}
            style={{ backgroundImage: `url(${tempImage})` }}
          />
          <div className={styles.itemInfo}>
            <p className={styles.itemId}>{'#23453234'}</p>
            <p className={styles.collectionName}>{'Hello'}</p>
          </div>
          <CloseModalIcon />
        </li>
      </ul>
      <div className={styles.currencyWrapper}>
        <p className={styles.totalText}>Total</p>
        <p className={styles.totalAmount}>{0.002124}</p>
        <div className={styles.separator} />
        <div className={styles.selectWrapper} ref={settingsRef}>
          <Select
            defaultValue={'SOL'}
            className={styles.select}
            suffixIcon={<ArrowDownBtn />}
            dropdownClassName={styles.dropdown}
            getPopupContainer={() => settingsRef.current}
          >
            <Option value="TOKEN" className={styles.option}>
              <div className={styles.tokenIcon} />
              <span className={styles.tokenText}>{`TOKEN`}</span>
            </Option>
            <Option value="SOL" className={styles.option}>
              <SolanaIcon />
              <span className={styles.tokenText}>SOL</span>
            </Option>
          </Select>
        </div>
      </div>
      <p className={styles.slippageInfo}>
        * Max total (with slippage) = {0.002124} SOL
      </p>
      <button className={styles.buyButton}>Buy for {'SOL'}</button>
    </div>
  );
};
