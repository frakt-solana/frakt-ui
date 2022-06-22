import { useEffect, useState } from 'react';

import { TotalStats, DailyStats, LastLoans, LedningPools } from './model';

export const useStatsPage = (): {
  totalStats: TotalStats;
  dailyStats: DailyStats;
  loading: boolean;
  lendingPools: LedningPools[];
  lastLoans: LastLoans[];
} => {
  const [totalStats, setTotalStats] = useState<TotalStats>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats>(null);
  const [lendingPools, setLendingPools] = useState<LedningPools[]>([]);
  const [lastLoans, setLastLoans] = useState<LastLoans[]>([]);

  const [totalStatsLoading, setTotalStatsLoading] = useState<boolean>(true);
  const [dailyStatsLoading, setDailyStatsLoading] = useState<boolean>(true);
  const [lastLoansLoading, setLastLoansLoading] = useState<boolean>(true);
  const [lendingPoolsStatsLoading, setLendingPoolsStatsLoading] =
    useState<boolean>(true);

  const fetchDailyStats = async (): Promise<void> => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/stats/daily`;

      const response = await fetch(URL);
      const dailyStats = await response.json();

      setDailyStats(dailyStats);
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setDailyStatsLoading(false);
    }
  };

  const fetchTotalStats = async (): Promise<void> => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/stats/total`;

      const response = await fetch(URL);
      const totalStats = await response.json();

      setTotalStats(totalStats);
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setTotalStatsLoading(false);
    }
  };

  const fetchLendingPools = async (): Promise<void> => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/stats/lending-pools`;

      const response = await fetch(URL);
      const lendingPools = await response.json();

      setLendingPools(lendingPools);
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setLendingPoolsStatsLoading(false);
    }
  };

  const fetchLastLoans = async (): Promise<void> => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/stats/last-loans`;

      const response = await fetch(URL);
      const lastLoans = await response.json();

      setLastLoans(lastLoans);
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setLastLoansLoading(false);
    }
  };

  const loading =
    totalStatsLoading ||
    dailyStatsLoading ||
    lendingPoolsStatsLoading ||
    lastLoansLoading;

  useEffect(() => {
    (async () => {
      await fetchTotalStats();
      await fetchDailyStats();
      await fetchLendingPools();
      await fetchLastLoans();
    })();
  }, []);

  return { totalStats, dailyStats, lendingPools, lastLoans, loading };
};
