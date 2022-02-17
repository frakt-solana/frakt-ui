import { FC } from 'react';

import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import { shortenAddress } from '../../../utils/solanaUtils';
import styles from './styles.module.scss';

interface NFTCardProps {
  safetyBox: SafetyBoxWithMetadata;
  onClick?: () => void;
}

export const NFTCard: FC<NFTCardProps> = ({ safetyBox, onClick }) => {
  const { nftMint, nftImage, nftName } = safetyBox;

  return (
    <div className={styles.nftListItemWrapper}>
      <div className={styles.nftListItem} onClick={onClick}>
        <div
          style={{ backgroundImage: `url(${nftImage})` }}
          className={styles.nftImage}
        />
        <div className={styles.nftInfoBlock}>
          <h5 className={styles.nftTitle}>{nftName}</h5>
          <span className={styles.nftInfoLabel}>NFT MINT</span>
          <span className={styles.nftInfoItem}>{shortenAddress(nftMint)}</span>
        </div>
      </div>
    </div>
  );
};
