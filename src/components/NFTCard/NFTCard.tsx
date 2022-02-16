import classNames from 'classnames/bind';
import { FC } from 'react';

import { UserNFT } from '../../contexts/userTokens';
import styles from './styles.module.scss';

interface NFTCardProps {
  nft: UserNFT;
  onClick?: () => void;
  onDetailsClick?: () => void;
}

export const NFTCard: FC<NFTCardProps> = ({ nft, onClick, onDetailsClick }) => {
  const { metadata } = nft;

  return (
    <div className={styles.nftCard}>
      <div
        className={classNames({
          [styles.borderHover]: true,
        })}
        onClick={onClick}
      />
      <div className={styles.nftImgWrapper}>
        <img src={metadata.image} alt="NFT card" className={styles.nftImage} />
      </div>
      <div className={styles.cardContentWrapper}>
        <p className={styles.nftName}>{metadata.name}</p>
        <span className={styles.collectionName}>Some collection</span>
        <button className={styles.detailsBtn} onClick={onDetailsClick}>
          Details
        </button>
      </div>
    </div>
  );
};
