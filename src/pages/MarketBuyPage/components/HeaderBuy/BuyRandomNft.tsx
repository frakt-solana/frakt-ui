import { FC, useRef, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import SettingsIcon from '../../../../icons/SettingsIcon';
import { Select } from 'antd';
import { ArrowDownBtn, SolanaIcon } from '../../../../icons';

const { Option } = Select;

interface BuyRandomNftProps {
  onBuy: () => void;
}

export const BuyRandomNft: FC<BuyRandomNftProps> = ({ onBuy }) => {
  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  const settingsRef = useRef();

  const toggleSlippageModal = () => setIsSlippageVisible(!isSlippageVisible);

  return (
    <div className={styles.buyWrapper}>
      <div className={styles.buySettings}>
        <div className={styles.settingsWrapper}>
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
          <div className={styles.separator} />
          <p className={styles.randomNFTsPrice}>{0.002124}</p>
          <div className={styles.separator} />
          <div className={styles.selectWrapper} ref={settingsRef}>
            <Select
              defaultValue={'TOKEN'}
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
      </div>
      <button className={styles.buyButton} onClick={onBuy}>
        Buy random NFT
      </button>
    </div>
  );
};
