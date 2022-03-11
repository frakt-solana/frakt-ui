import { FC } from 'react';
import classNames from 'classnames/bind';

import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import { shortenAddress } from '../../../utils/solanaUtils';
import styles from './NFTCard.module.scss';

interface NFTCardProps {
  safetyBox: SafetyBoxWithMetadata;
  onClick?: () => void;
  className?: string;
}

export const NFTCard: FC<NFTCardProps> = ({
  safetyBox,
  onClick,
  className,
}) => {
  const { nftMint, nftImage, nftName } = safetyBox;

  return (
    <div className={classNames(styles.nftListItemWrapper, className)}>
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
