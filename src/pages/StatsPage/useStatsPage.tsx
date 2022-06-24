import { useEffect, useState } from 'react';

import { DailyStats, Stats } from './model';

export const useStatsPage = (): {
  stats: Stats;
  loading: boolean;
} => {
  const [stats, setStats] = useState<Stats>(null);

  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const fetchStatsInfo = async (): Promise<void> => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/stats/all`;

      const response = await fetch(URL);
      const statsInfo = await response.json();

      setStats(statsInfo);
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loading = statsLoading;

  useEffect(() => {
    (async () => {
      await fetchStatsInfo();
    })();
  }, []);

  return { stats, loading };
};
