import { FC } from 'react';

import { SOL_TOKEN } from '../../../../utils';
import styles from './Lending.module.scss';
import Block from '../Block';
import okayBears from '../PoolsRaw/mockImage/okayBears.png';
import degods from '../PoolsRaw/mockImage/degods.png';
import { LedningPools, LastLoans } from '../../../../state/stats/types';

interface LendingProps {
  lendingPools: LedningPools[];
  lastLoans: LastLoans[];
}

const Lending: FC<LendingProps> = ({ lendingPools, lastLoans }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Lending</h2>
      <Block className={styles.block}>
        <div className={styles.lendingConainer}>
          <div className={styles.cardContainer}>
            <h3 className={styles.subtitle}>Last loans</h3>
            <div className={styles.cards}>
              {lastLoans.map(({ nftName, loanValue, image }, idx) => (
                <div key={idx} className={styles.card}>
                  <img src={image} className={styles.nftImage} />
                  <p className={styles.nftName}>{nftName}</p>
                  <p className={styles.cardTitle}>Loan Value</p>
                  <div className={styles.nftValue}>
                    <p>{loanValue}</p>
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
              {lendingPools.map(({ nftName, apr, image, tvl }, idx) => (
                <div key={idx} className={styles.tableRow}>
                  <div className={styles.tableInfo}>
                    <p className={styles.rowNumber}>{idx + 1}</p>
                    {image === 'image' ? (
                      <div className={styles.mockImages}>
                        <img className={styles.rowImage} src={okayBears} />
                        <img className={styles.rowImage} src={degods} />
                      </div>
                    ) : (
                      <img className={styles.rowImage} src={image} />
                    )}
                    <p className={styles.rowTitle}>{nftName}</p>
                  </div>
                  <div className={styles.tableStats}>
                    <p>{apr.toFixed(2)} %</p>
                    <p>{tvl.toFixed(2)} SOL</p>
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
