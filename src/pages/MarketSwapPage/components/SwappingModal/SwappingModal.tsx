import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { CloseModalIcon, SwapMarketIcon } from '../../../../icons';
import classNames from 'classnames';

interface BuyingModalProps {
  selectedSwapFrom: any;
  selectedSwapTo: any;
  isPrivetNFTsList: boolean;
  changeNFTsList: (isPrivetNFTsListNeeded: boolean) => void;
  onDeselect?: (nft: any) => void;
}

export const SwappingModal: FC<BuyingModalProps> = ({
  selectedSwapFrom,
  selectedSwapTo,
  isPrivetNFTsList,
  changeNFTsList,
  onDeselect,
}) => {
  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  const activeTab = !selectedSwapFrom || !selectedSwapTo;

  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.modalDown]: isModalDown,
      })}
    >
      <div className={styles.openModal} onClick={() => setIsModalDown(false)} />
      <div className={styles.closeModal} onClick={() => setIsModalDown(true)}>
        <CloseModalIcon width={20} />
      </div>
      <div
        className={classNames({
          [styles.swapItem]: true,
          [styles.swapItemFrom]: true,
          [styles.swapItemActive]:
            (isPrivetNFTsList && activeTab) || isModalDown,
        })}
      >
        <div className={styles.header}>
          <p className={styles.title}>Swap from</p>
        </div>
        {!selectedSwapFrom ? (
          <>
            <p className={styles.noSelected}>Choose your assets to swap from</p>
            {!isPrivetNFTsList && (
              <button
                className={styles.selectAssets}
                onClick={() => changeNFTsList(true)}
              >
                Select assets
              </button>
            )}
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
              onClick={() => onDeselect(true)}
            >
              <CloseModalIcon />
            </div>
          </div>
        )}
        <div
          className={classNames({
            [styles.swapIconWrapper]: true,
            [styles.swapIconActive]: !activeTab,
          })}
        >
          <SwapMarketIcon />
        </div>
      </div>
      <div className={classNames({ [styles.decorLines]: !activeTab })} />
      <div
        className={classNames({
          [styles.swapItem]: true,
          [styles.swapItemTo]: true,
          [styles.swapItemActive]: !isPrivetNFTsList && activeTab,
        })}
      >
        <div className={styles.header}>
          <p className={styles.title}>Swap to</p>
        </div>
        {!selectedSwapTo ? (
          <>
            <p className={styles.noSelected}>Choose your assets to receive</p>
            {isPrivetNFTsList && (
              <button
                className={styles.selectAssets}
                onClick={() => changeNFTsList(false)}
              >
                Select assets
              </button>
            )}
          </>
        ) : (
          <div className={styles.selectedItem}>
            <div
              className={styles.itemImg}
              style={{ backgroundImage: `url(${selectedSwapTo?.nftImage})` }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemId}>{selectedSwapTo?.nftId}</p>
              <p className={styles.collectionName}>
                {selectedSwapTo?.collectionName}
              </p>
            </div>
            <div
              className={styles.closeWrapper}
              onClick={() => onDeselect(false)}
            >
              <CloseModalIcon />
            </div>
          </div>
        )}
        {selectedSwapFrom && selectedSwapTo && (
          <button className={styles.swapButton}>Swap</button>
        )}
      </div>
    </div>
  );
};
