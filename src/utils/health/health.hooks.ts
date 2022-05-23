import { useEffect, useState } from 'react';
import getSolanaNetworkHealth from './health.helpers';
import { SolanaNetworkHealthValues } from './health.model';

export const useHealth = (): SolanaNetworkHealthValues => {
  const [health, setHealth] = useState({ loss: null, health: null });

  useEffect(() => {
    async function getHealth() {
      setHealth(await getSolanaNetworkHealth(5));
    }
    getHealth();
  }, []);

  return health;
};
