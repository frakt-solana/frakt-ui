import classNames from 'classnames/bind';
import { FC } from 'react';

import { UserNFT } from '../../contexts/userTokens';
import styles from './styles.module.scss';

interface NFTCardProps {
  nft: UserNFT;
  onClick?: () => void;
  onDetailsClick?: () => void;
  isSelected?: boolean;
}

export const NFTCard: FC<NFTCardProps> = ({
  nft,
  onClick,
  onDetailsClick,
  isSelected = false,
}) => {
  const { metadata } = nft;

  return (
    <div className={styles.nftCardWrapper} onClick={onClick}>
      <div
        className={classNames([
          styles.nftCard,
          { [styles.nftCardHover]: !!onClick },
          { [styles.nftCardSelected]: isSelected },
        ])}
      >
        <div className={styles.nftImgWrapper}>
          <img
            src={metadata.image}
            alt="NFT card"
            className={styles.nftImage}
          />
        </div>
        <div className={styles.cardContentWrapper}>
          <p className={styles.nftName}>{metadata.name}</p>
          <span className={styles.collectionName}>Some collection</span>
          <button
            className={styles.detailsBtn}
            onClick={(event) => {
              onDetailsClick();
              event.stopPropagation();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
