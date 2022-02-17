import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { Select } from 'antd';

import { UserNFT } from '../../../../contexts/userTokens';
import styles from './styles.module.scss';
import SettingsIcon from '../../../../icons/SettingsIcon';
import { ArrowDownBtn, CloseModalIcon, SolanaIcon } from '../../../../icons';

const { Option } = Select;

interface BuyingModalProps {
  onSubmit: () => void;
  onDeselect?: (nft: any) => void;
  nft: UserNFT;
}

export const SellingModal: FC<BuyingModalProps> = ({
  onDeselect,
  nft,
  onSubmit,
}) => {
  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);
  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  const settingsRef = useRef();

  const toggleSlippageModal = () => setIsSlippageVisible(!isSlippageVisible);

  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.visible]: !!nft,
        [styles.modalDown]: isModalDown && !!nft,
      })}
    >
      {/* <div className={styles.closeModal} onClick={() => setIsModalDown(true)}>
        <CloseModalIcon width={20} />
      </div> */}
      <div className={styles.header}>
        <p
          className={styles.title}
          onClick={() => setIsModalDown(!isModalDown)}
        >
          You&apos;re selling{!!nft && <span>1</span>}
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
        {!!nft && (
          <li className={styles.selectedItem}>
            <div
              className={styles.itemImg}
              style={{ backgroundImage: `url(${nft.metadata.image})` }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemId}>{nft.metadata.name}</p>
              {/* <p className={styles.collectionName}>{nft.collectionName}</p> */}
            </div>
            <div
              className={styles.closeWrapper}
              onClick={() => onDeselect(nft)}
            >
              <CloseModalIcon />
            </div>
          </li>
        )}
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
      <button className={styles.buyButton} onClick={onSubmit}>
        Sell for {'SOL'}
      </button>
    </div>
  );
};
