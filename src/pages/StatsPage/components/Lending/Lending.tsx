import { FC } from 'react';

import styles from './Lending.module.scss';
import Block from '../Block';
import { SOL_TOKEN } from '../../../../utils';

const Lending: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Lending</h2>
      <Block className={styles.block}>
        <div className={styles.lendingConainer}>
          <div className={styles.cardContainer}>
            <h3 className={styles.subtitle}>Last loans</h3>
            <div className={styles.cards}>
              {mockCards.map(({ name, value, image }, idx) => (
                <div key={idx} className={styles.card}>
                  <img src={image} className={styles.nftImage} />
                  <p className={styles.nftName}>{name}</p>
                  <p className={styles.cardTitle}>Loan Value</p>
                  <div className={styles.nftValue}>
                    <p>{value}</p>
                    <img className={styles.icon} src={SOL_TOKEN.logoURI} />
                    SOL
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.line} />
          <div style={{ width: '100%' }}>
            <h3 className={styles.subtitle}>Lending pools</h3>
            <div className={styles.table}>
              <div className={styles.header}>
                <p className={styles.headerTitle}>Name</p>
                <div className={styles.headerValues}>
                  <p className={styles.headerTitle}>Apr</p>
                  <p className={styles.headerTitle}>TVL</p>
                </div>
              </div>
              {mockTable.map(({ name, apr, image, tvl }, idx) => (
                <div key={idx} className={styles.tableRow}>
                  <div className={styles.tableInfo}>
                    <p className={styles.rowNumber}>{idx + 1}</p>
                    <img className={styles.rowImage} src={image} />
                    <p className={styles.rowTitle}>{name}</p>
                  </div>
                  <div className={styles.tableStats}>
                    <p>{apr} %</p>
                    <p>{tvl} SOL</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Block>
    </div>
  );
};

export default Lending;

const mockCards = [
  {
    name: 'Degen Ape #5453',
    value: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/2r9U-XIjrWajP7TRM3nUWuqcGolr2PL3uv3tS0vxjhs',
  },
  {
    name: 'SolPunk #6290',
    value: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/p2cTCJCkckFVDtxf3QpcfJJk1nEFA4pPrwGmHTiKg3E',
  },
  {
    name: 'Rayford Vandyke',
    value: '26.49',
    image: 'https://i.imgur.com/DnOVkxY.png',
  },
];

const mockTable = [
  {
    name: 'Degen Ape #5453',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/2r9U-XIjrWajP7TRM3nUWuqcGolr2PL3uv3tS0vxjhs',
  },
  {
    name: 'SolPunk #6290',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/p2cTCJCkckFVDtxf3QpcfJJk1nEFA4pPrwGmHTiKg3E',
  },
  {
    name: 'Rayford Vandyke',
    apr: '26.49',
    tvl: '26.49',
    image: 'https://i.imgur.com/DnOVkxY.png',
  },
  {
    name: 'Degen Ape #5453',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/2r9U-XIjrWajP7TRM3nUWuqcGolr2PL3uv3tS0vxjhs',
  },
  {
    name: 'SolPunk #6290',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/p2cTCJCkckFVDtxf3QpcfJJk1nEFA4pPrwGmHTiKg3E',
  },
  {
    name: 'Rayford Vandyke',
    apr: '26.49',
    tvl: '26.49',
    image: 'https://i.imgur.com/DnOVkxY.png',
  },
  {
    name: 'Degen Ape #5453',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/2r9U-XIjrWajP7TRM3nUWuqcGolr2PL3uv3tS0vxjhs',
  },
  {
    name: 'SolPunk #6290',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/p2cTCJCkckFVDtxf3QpcfJJk1nEFA4pPrwGmHTiKg3E',
  },
  {
    name: 'Rayford Vandyke',
    apr: '26.49',
    tvl: '26.49',
    image: 'https://i.imgur.com/DnOVkxY.png',
  },
  {
    name: 'SolPunk #6290',
    apr: '26.49',
    tvl: '26.49',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/p2cTCJCkckFVDtxf3QpcfJJk1nEFA4pPrwGmHTiKg3E',
  },
  {
    name: 'Rayford Vandyke',
    apr: '26.49',
    tvl: '26.49',
    image: 'https://i.imgur.com/DnOVkxY.png',
  },
];
