import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';

import { useUserSplAccount } from './useUserSplAccount';

const DEFAULT_DECIMALS = 9;

export const useSplTokenBalance = (
  tokenMint: string,
  decimals = DEFAULT_DECIMALS,
): {
  balance: number;
} => {
  const { connected } = useWallet();

  const { accountInfo, subscribe: splTokenSubscribe } = useUserSplAccount();

  useEffect(() => {
    if (connected && tokenMint && decimals) {
      splTokenSubscribe(new PublicKey(tokenMint));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, tokenMint, decimals]);

  const balance = accountInfo
    ? accountInfo?.accountInfo?.amount?.toNumber() / 10 ** decimals
    : 0;

  return {
    balance,
  };
};
