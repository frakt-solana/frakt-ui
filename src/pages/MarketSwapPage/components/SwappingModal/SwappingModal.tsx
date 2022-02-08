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
  selectedSwapFrom: any;
  selectedSwapTo: any;
}

export const SwappingModal: FC<BuyingModalProps> = ({
  onDeselect,
  selectedSwapFrom,
  selectedSwapTo,
}) => {
  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.modalDown]: isModalDown,
      })}
    >
      <div
        className={styles.closeOpenModal}
        onClick={() => setIsModalDown(!isModalDown)}
      >
        Close/Open
      </div>
      <div className={`${styles.swapItem} ${styles.swapItemFrom}`}>
        <div className={styles.header}>
          <p className={styles.title}>Swap from</p>
        </div>
        {!selectedSwapFrom ? (
          <>
            <p className={styles.noSelected}>Choose your assets to swap from</p>
            <button className={styles.selectAssets}>Select assets</button>
          </>
        ) : (
          <div className={styles.selectedItem}>
            <div
              className={styles.itemImg}
              style={{ backgroundImage: `url(${selectedSwapFrom?.nftImage})` }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemId}>{selectedSwapFrom?.nftId}</p>
              <p className={styles.collectionName}>
                {selectedSwapFrom?.collectionName}
              </p>
            </div>
            <div
              className={styles.closeWrapper}
              onClick={() => onDeselect('nft')}
            >
              <CloseModalIcon />
            </div>
          </div>
        )}
      </div>
      {selectedSwapFrom && selectedSwapTo && (
        <button className={styles.swapButton}>Swap</button>
      )}
    </div>
  );
};
