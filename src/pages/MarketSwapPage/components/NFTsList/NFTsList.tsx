import styles from './styles.module.scss';
import React, { FC } from 'react';
import classNames from 'classnames';

interface NFTsListProps {
  nfts: any;
  selectedNFT: any;
  onCardClick: (nft: any) => void;
  onNftItemClick: (index: number) => () => void;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  selectedNFT,
  onCardClick,
  onNftItemClick,
}) => {
  return (
    <ul className={styles.poolsList}>
      {nfts.map((item, index) => (
        <li key={index} className={styles.nftCard}>
          <div
            className={classNames({
              [styles.borderHover]: true,
              [styles.selected]: selectedNFT?.nftId === item.nftId,
            })}
            onClick={() => onCardClick(item)}
          />
          <div className={styles.nftImgWrapper}>
            <img
              src={item.nftImage}
              alt="NFT card"
              className={styles.nftImage}
            />
          </div>
          <div className={styles.cardContentWrapper}>
            <p className={styles.nftName}>{item.nftId}</p>
            <span className={styles.collectionName}>{item.collectionName}</span>
            <button
              className={styles.detailsBtn}
              onClick={onNftItemClick(index)}
            >
              Details
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
