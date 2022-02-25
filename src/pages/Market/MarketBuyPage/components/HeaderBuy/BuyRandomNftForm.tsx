import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './HeaderBuy.module.scss';
import SettingsIcon from '../../../../../icons/SettingsIcon';
import { ArrowDownBtn, SolanaIcon } from '../../../../../icons';
import { useNativeAccount } from '../../../../../utils/accounts';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const { Option } = Select;

interface BuyRandomNftFormProps {
  onBuy: () => void;
  poolTokenAvailable: boolean;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

enum Price {
  SOL = 15.143,
  POOL_TOKEN = 1,
}

export const BuyRandomNftForm: FC<BuyRandomNftFormProps> = ({
  onBuy,
  poolTokenAvailable,
}) => {
  const { connected } = useWallet();
  const { account } = useNativeAccount();

  const solBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  const settingsRef = useRef();

  const [token, setToken] = useState<Token>(Token.SOL);

  useEffect(() => {
    poolTokenAvailable && setToken(Token.POOL_TOKEN);
  }, [poolTokenAvailable]);

  const price = token === Token.SOL ? Price.SOL : Price.POOL_TOKEN;

  const slippageText =
    token === Token.SOL
      ? `* Max total (with slippage) = ${(Price.SOL * 1.02).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    !connected ||
    (token === Token.POOL_TOKEN && !poolTokenAvailable) ||
    (token === Token.SOL && solBalance < Price.SOL);

  return (
    <div className={styles.buyWrapper}>
      <div className={styles.buySettings}>
        <div className={styles.settingsWrapper}>
          {token === Token.SOL && (
            <SlippageSelector
              isSlippageVisible={isSlippageVisible}
              setIsSlippageVisible={setIsSlippageVisible}
            />
          )}
          <p className={styles.randomNFTsPrice}>{price}</p>
          <div className={styles.separator} />
          <div className={styles.selectWrapper} ref={settingsRef}>
            {poolTokenAvailable ? (
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
            ) : (
              <div className={styles.option}>
                <SolanaIcon />
                <span className={styles.tokenText}>SOL</span>
              </div>
            )}
          </div>
        </div>
        <p className={styles.slippageInfo}>{slippageText}</p>
      </div>
      <button
        className={styles.buyButton}
        onClick={onBuy}
        disabled={isBtnDisabled}
      >
        Buy random
      </button>
    </div>
  );
};

interface SlippageSelectorProps {
  isSlippageVisible: boolean;
  setIsSlippageVisible: (nextValue: boolean) => void;
}

const SlippageSelector: FC<SlippageSelectorProps> = ({
  isSlippageVisible,
  setIsSlippageVisible,
}) => {
  const toggleSlippageModal = () => setIsSlippageVisible(!isSlippageVisible);

  return (
    <>
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
    </>
  );
};
