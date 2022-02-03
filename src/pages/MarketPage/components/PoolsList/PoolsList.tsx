import styles from './styles.module.scss';
import { SolanaIcon } from '../../../../icons';
import React, { FC } from 'react';

const tempImage =
  'https://w55pcai3doppkjvizydkia7l3kkdl3rdexzt5rlduyukdfehs4yq.arweave.net/t3rxARsbnvUmqM4GpAPr2pQ17iMl8z7FY6YooZSHlzE';

const POOLS_DATA = [
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
  {
    poolImage: tempImage,
    collectionsAmount: 123,
    itemsAmount: 123124,
    tokenName: 'PUNKS',
    tokenImage: tempImage,
    price: '0.000',
  },
];

export const PoolsList: FC = () => {
  return (
    <ul className={styles.poolsList}>
      {POOLS_DATA.map((item, index) => (
        <li key={index} className={styles.poolCard}>
          <div className={styles.poolImgWrapper}>
            <img
              src={item.poolImage}
              alt="pool card"
              className={styles.poolImage}
            />
            <div className={styles.poolShadow}>
              <p className={styles.poolInfoLabel}>
                {item.collectionsAmount} collections
              </p>
              <p className={styles.poolInfoLabel}>{item.itemsAmount} items</p>
            </div>
          </div>
          <div className={styles.cardContentWrapper}>
            <div className={styles.poolTokenInfo}>
              <div
                className={styles.tokenImage}
                style={{ backgroundImage: `url(${item.tokenImage})` }}
              />
              <p className={styles.tokenName}>{item.tokenName}</p>
            </div>
            <span className={styles.priceLabel}>price</span>
            <div className={styles.priceWrapper}>
              <span className={styles.poolPrice}>{item.price}</span>
              <SolanaIcon />
              <span className={styles.priceCurrency}>SOL</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
