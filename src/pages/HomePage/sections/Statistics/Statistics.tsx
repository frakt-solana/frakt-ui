import { useCountUp } from 'react-countup';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Container } from '../../../../components/Layout';
import { useEffect, useRef, useState } from 'react';

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

  const lockedNFTRef = useRef(null);
  const { update: updateLockedNFTCount } = useCountUp({
    ref: lockedNFTRef,
    start: 0,
    end: 0,
    startOnMount: false,
    duration: 2,
    separator: ',',
  });
  const issuedTokensRef = useRef(null);
  const { update: updateIssuedTokensCount } = useCountUp({
    ref: issuedTokensRef,
    start: 0,
    end: 0,
    startOnMount: false,
    duration: 2,
    separator: ',',
  });
  const tvlRef = useRef(null);
  const { update: updateTvlCount } = useCountUp({
    ref: tvlRef,
    start: 0,
    end: 0,
    startOnMount: false,
    duration: 2,
    decimals: 2,
    separator: ',',
  });

  useEffect(() => {
    if (!isLoading) {
      updateLockedNFTCount(statistic?.lockedNFTs || 0);
      updateIssuedTokensCount(statistic?.issuedTokens || 0);
      updateTvlCount(statistic?.TVL * price || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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
          <span className={styles.title}>NFTs Locked in Vaults</span>
          <span className={styles.value}>
            {isLoading ? '--' : <span ref={lockedNFTRef} />}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Issued Tokens</span>
          <span className={styles.value}>
            {isLoading ? '--' : <span ref={issuedTokensRef} />}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.title}>Total Value Locked</span>
          <span className={styles.value}>
            {isLoading ? (
              '--'
            ) : (
              <span>
                $<span ref={tvlRef} />
              </span>
            )}
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Statistics;
