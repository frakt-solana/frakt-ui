import { useState, useEffect } from 'react';
import { fetchVaultTokenHoldersAmount } from './fraktionOwners.helpers';

export const useVaultTokenHoldersAmount = (
  fractionMint: string,
): { amount: number; loading: boolean } => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAmount = async () => {
    try {
      const amount = await fetchVaultTokenHoldersAmount(fractionMint);
      setAmount(amount);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { amount, loading };
};
