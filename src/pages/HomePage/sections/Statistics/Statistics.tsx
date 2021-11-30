import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Container } from '../../../../components/Layout';
import { useEffect, useState } from 'react';
import { notify } from '../../../../external/utils/notifications';
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

const Statistics = ({ rollback }: { rollback: JSX.Element }): JSX.Element => {
  const [hasError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statistic, setStatistic] = useState<Statistic | null>(null);
  const [price, setPrice] = useState(1);

  useEffect(() => {
    const promises = [
      getSolanaPrice().then(setPrice),
      getStatistic().then(setStatistic),
    ];
    Promise.all(promises)
      .catch(() => {
        notify({
          message: 'Failed to fetch statistic',
          type: 'error',
        });
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || hasError)
    return <Container component="div">{rollback || null}</Container>;

  return (
    <div className={classNames([styles.statistics])}>
      <Container component="div" className={styles.statisticsContainer}>
        <div className={styles.stat}>
          <span className={styles.title}>Locked NFTs</span>
          <span className={styles.value}>
            {numeral(statistic.lockedNFTs).format('0,0')}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Issued Tokens</span>
          <span className={styles.value}>
            {numeral(statistic.issuedTokens).format('0,0.000')}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Total Value Locked</span>
          <span className={styles.value}>
            $ {numeral(statistic.TVL * price).format('0,0.00')}
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Statistics;
