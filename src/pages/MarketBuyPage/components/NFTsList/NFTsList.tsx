import styles from './styles.module.scss';
import React, { FC } from 'react';
import classNames from 'classnames';

interface NFTsListProps {
  nfts: any;
  selectedNFTs: any;
  onCardClick: (nft: any) => void;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  selectedNFTs,
  onCardClick,
}) => {
  return (
    <ul className={styles.poolsList}>
      {nfts.map((item, index) => (
        <li
          key={index}
          className={styles.nftCard}
          onClick={() => onCardClick(item)}
        >
          <div
            className={classNames({
              [styles.borderHover]: true,
              [styles.selected]: !!selectedNFTs.find(
                (selectedNft) => selectedNft?.nftId === item.nftId,
              ),
            })}
          />
          <div className={styles.nftImgWrapper}>
            <img
              src={item.poolImage}
              alt="pool card"
              className={styles.nftImage}
            />
          </div>
          <div className={styles.cardContentWrapper}>
            <p className={styles.nftName}>{item.nftId}</p>
            <span className={styles.collectionName}>{item.collectionName}</span>
            <button className={styles.detailsBtn}>Details</button>
          </div>
        </li>
      ))}
    </ul>
  );
};
