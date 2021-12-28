import { UserNFT } from '../../../../contexts/userTokens';
import styles from './styles.module.scss';
import React from 'react';

interface HeaderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  isBasket: boolean;
  lockedNFT: {
    nftImage: string;
    nftMint: string;
  }[];
}

export const Header = ({
  nfts,
  onDeselect,
  isBasket,
  lockedNFT,
}: HeaderProps): JSX.Element => {
  return (
    <div className={styles.header}>
      <p className={styles.title}>{isBasket ? 'Your NFTs' : 'Your NFT'}</p>
      <div className={styles.images}>
        {lockedNFT.map(({ nftImage, nftMint }) => (
          <div
            key={nftMint}
            className={styles.image}
            style={{ backgroundImage: `url(${nftImage})` }}
          ></div>
        ))}
        {nfts.map((nft, idx) => (
          <div
            key={idx}
            className={styles.image}
            style={{ backgroundImage: `url(${nft?.metadata?.image})` }}
          >
            <button
              className={styles.removeBtn}
              onClick={() => onDeselect(nft)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
