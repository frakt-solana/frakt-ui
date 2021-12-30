import React, { FC } from 'react';
import styles from './styles.module.scss';
import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import classNames from 'classnames';
import { shortenAddress } from '../../../utils/solanaUtils';

interface NFTListProps {
  safetyBoxes: SafetyBoxWithMetadata[];
  className?: string;
}

export const NFTList: FC<NFTListProps> = ({ safetyBoxes, className }) => {
  return (
    <>
      <ul className={classNames(styles.nftList, className)}>
        {safetyBoxes.map((nft) => (
          <li className={styles.nftListItem} key={nft.vaultPubkey}>
            <div
              style={{ backgroundImage: `url(${nft.nftImage})` }}
              className={styles.nftImage}
            />
            <div className={styles.nftInfoBlock}>
              <h4 className={styles.nftTitle}>{nft.nftName}</h4>
              <span className={styles.nftInfoLabel}>NFT MINT</span>
              <span className={styles.nftInfoItem}>
                {shortenAddress(nft.nftMint)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
