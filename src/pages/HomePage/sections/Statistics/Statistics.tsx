import { useCountUp } from 'react-countup';
import { FC, useEffect, useRef, useState } from 'react';

import styles from './Statistics.module.scss';
import { useOnScreen } from '../../../../hooks';
import { Container } from '../../../../components/Layout';

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

const Statistics: FC = () => {
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
  const tvlRef = useRef(null);
  const { update: updateTvlCount } = useCountUp({
    ref: tvlRef,
    start: 0,
    end: 0,
    startOnMount: false,
    duration: 2,
    decimals: 2,
    separator: ',',
    prefix: '$',
  });

  const isLockedNFTRef = useOnScreen(lockedNFTRef);
  const isTvlRefVisible = useOnScreen(tvlRef);

  useEffect(() => {
    if (!isLoading && isTvlRefVisible) {
      updateTvlCount(statistic?.TVL * price || 0);
    }
    if (!isLoading && isLockedNFTRef) {
      updateLockedNFTCount(statistic?.lockedNFTs || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isTvlRefVisible, isLockedNFTRef]);

  useEffect(() => {
    const promises = [
      getSolanaPrice().then(setPrice),
      getStatistic().then(setStatistic),
    ];
    Promise.all(promises).finally(() => setIsLoading(false));
  }, []);

  return (
    <Container component="section" className={styles.root}>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span style={{ display: isLoading ? 'inline' : 'none' }}>---</span>
          <span
            ref={lockedNFTRef}
            style={{ display: isLoading ? 'none' : 'inline' }}
          />
        </span>
        <span className={styles.title}>NFTs locked</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span style={{ display: isLoading ? 'inline' : 'none' }}>---</span>
          <span
            ref={tvlRef}
            style={{ display: isLoading ? 'none' : 'inline' }}
          />
        </span>
        <span className={styles.title}>Total Value Locked</span>
      </div>
    </Container>
  );
};

export default Statistics;
