import { UserNFT } from '../../../../contexts/userTokens';
import styles from './styles.module.scss';
import React from 'react';
import { Slider } from './Slider';

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
      <Slider nfts={nfts} lockedNFT={lockedNFT} onDeselect={onDeselect} />
    </div>
  );
};
