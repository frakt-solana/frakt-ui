import { useState, useCallback, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

import { getStakingPointsURL } from '../../../utils';

export const useStakingPoints = (
  walletAddress: PublicKey,
): {
  stakingPoints: number;
} => {
  const [stakingPoints, setStakingPoints] = useState<number>(0);

  const getStakingPoints = useCallback(async (walletAddress) => {
    try {
      const { userScore } = await (
        await fetch(getStakingPointsURL(walletAddress))
      ).json();

      setStakingPoints(Math.floor(userScore / 10));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      void getStakingPoints(walletAddress);
    }
  }, [walletAddress, getStakingPoints]);

  return { stakingPoints };
};
