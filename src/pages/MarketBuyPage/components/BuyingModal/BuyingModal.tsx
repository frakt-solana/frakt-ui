import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import SettingsIcon from '../../../../icons/SettingsIcon';
import { ArrowDownBtn, CloseModalIcon, SolanaIcon } from '../../../../icons';
import classNames from 'classnames';
import { Select } from 'antd';

const { Option } = Select;
const tempImage =
  'https://www.arweave.net/xW93zrDmljTvqDiEQdJ5PuMq4CVL5Rz1vAjUO4TznD8';

interface BuyingModalProps {
  onDeselect?: (nft: any) => void;
  nfts: any;
}

export const BuyingModal: FC<BuyingModalProps> = ({ onDeselect, nfts }) => {
  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);
  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  const settingsRef = useRef();

  const toggleSlippageModal = () => setIsSlippageVisible(!isSlippageVisible);

  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.visible]: nfts.length,
        [styles.modalDown]: isModalDown,
      })}
    >
      <div className={styles.header}>
        <p
          className={styles.title}
          onClick={() => setIsModalDown(!isModalDown)}
        >
          You&apos;re buying<span>{nfts.length}</span>
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
        {nfts.map((nft, index) => (
          <li key={index} className={styles.selectedItem}>
            <div
              className={styles.itemImg}
              style={{ backgroundImage: `url(${tempImage})` }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemId}>{nft.nftId}</p>
              <p className={styles.collectionName}>{nft.collectionName}</p>
            </div>
            <div
              className={styles.closeWrapper}
              onClick={() => onDeselect(nft)}
            >
              <CloseModalIcon />
            </div>
          </li>
        ))}
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
