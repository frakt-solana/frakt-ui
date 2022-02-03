import styles from './styles.module.scss';
import React, { FC } from 'react';

const tempImage =
  'https://www.arweave.net/xW93zrDmljTvqDiEQdJ5PuMq4CVL5Rz1vAjUO4TznD8';

const POOLS_DATA = [
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
  {
    poolImage: tempImage,
    nftName: 'PUNKS',
    collectionName: 'cryptopunks',
  },
];

export const NFTsList: FC = () => {
  return (
    <ul className={styles.poolsList}>
      {POOLS_DATA.map((item, index) => (
        <li key={index} className={styles.nftCard}>
          <div className={styles.nftImgWrapper}>
            <img
              src={item.poolImage}
              alt="pool card"
              className={styles.nftImage}
            />
          </div>
          <div className={styles.cardContentWrapper}>
            <p className={styles.nftName}>{item.nftName}</p>
            <span className={styles.collectionName}>{item.collectionName}</span>
            <button className={styles.detailsBtn}>Details</button>
          </div>
        </li>
      ))}
    </ul>
  );
};
