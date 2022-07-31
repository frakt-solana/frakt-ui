import { useCountUp } from 'react-countup';
import { FC, useEffect, useRef, useState } from 'react';

import styles from './Statistics.module.scss';
import { useOnScreen } from '../../../../hooks';
import { Container } from '../../../../components/Layout';
import { Stats } from './model';
import { fetchStats } from './helpers';

const useStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchAndSetStats = async () => {
    setLoading(true);
    const stats = await fetchStats();

    setStats(stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetStats();
  }, []);

  return {
    stats,
    loading,
  };
};

const Statistics: FC = () => {
  const { loading, stats } = useStats();

  const lockedNFTRef = useRef(null);
  const { update: updateLockedNFTCount, reset: resetLockedNFTCount } =
    useCountUp({
      ref: lockedNFTRef,
      start: 0,
      end: 0,
      startOnMount: false,
      duration: 2,
      separator: ',',
    });
  const tvlRef = useRef(null);
  const { update: updateTvlCount, reset: resetTvlCount } = useCountUp({
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
    if (!loading && isTvlRefVisible && stats) {
      updateTvlCount(stats.TVL);
    }
    if (!loading && isLockedNFTRef) {
      updateLockedNFTCount(stats.nftsLocked);
    }

    return () => {
      resetLockedNFTCount();
      resetTvlCount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isTvlRefVisible, isLockedNFTRef, stats]);

  return (
    <Container component="section" className={styles.root}>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span style={{ display: loading ? 'inline' : 'none' }}>---</span>
          <span
            ref={lockedNFTRef}
            style={{ display: loading ? 'none' : 'inline' }}
          />
        </span>
        <span className={styles.title}>NFTs locked</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span style={{ display: loading ? 'inline' : 'none' }}>---</span>
          <span ref={tvlRef} style={{ display: loading ? 'none' : 'inline' }} />
        </span>
        <span className={styles.title}>Total Value Locked</span>
      </div>
    </Container>
  );
};

export default Statistics;
