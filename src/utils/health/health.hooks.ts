import { useEffect, useState } from 'react';
import getSolanaNetworkHealth from './health.helpers';

export const useHealth = () => {
  const [health, setHealth] = useState({});

  useEffect(() => {
    async function getHealth() {
      setHealth(await getSolanaNetworkHealth(5));
    }
    getHealth();
  }, []);

  return health;
};
