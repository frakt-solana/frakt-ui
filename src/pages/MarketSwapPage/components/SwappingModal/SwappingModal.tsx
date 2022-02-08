import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { CloseModalIcon } from '../../../../icons';
import classNames from 'classnames';

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
