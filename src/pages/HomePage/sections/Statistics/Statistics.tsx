import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Container } from '../../../../components/Layout';
import { useEffect, useState } from 'react';
import numeral from 'numeral';

interface Statistic {
  lockedNFTs: number;
  issuedTokens: number;
  TVL: number;
}

const getSolanaPrice = () =>
  fetch('https://api.coingecko.com/api/v3/coins/solana')
    .then((res) => res.json())
    .then(
      (data) =>
        data.tickers.find((el) => el.target === 'USD').converted_last.usd,
    );

const getStatistic = (): Promise<Statistic> =>
  fetch('https://frakt-stats.herokuapp.com/fraktion').then(
    (res) => res.json() as Promise<Statistic>,
  );

const Statistics = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [statistic, setStatistic] = useState<Statistic | null>(null);
  const [price, setPrice] = useState(1);

  useEffect(() => {
    const promises = [
      getSolanaPrice().then(setPrice),
      getStatistic().then(setStatistic),
    ];
    Promise.all(promises).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={classNames([styles.statistics])}>
      <Container component="div" className={styles.statisticsContainer}>
        <div className={styles.stat}>
          <span className={styles.title}>Locked NFTs</span>
          <span className={styles.value}>
            {isLoading ? 51 : numeral(statistic?.lockedNFTs).format('0,0')}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Issued Tokens</span>
          <span className={styles.value}>
            {numeral(isLoading ? 11432532000 : statistic?.issuedTokens).format(
              '0,0',
            )}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Total Value Locked</span>
          <span className={styles.value}>
            ${' '}
            {numeral(isLoading ? 514542.55 : statistic?.TVL * price).format(
              '0,0.00',
            )}
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Statistics;
