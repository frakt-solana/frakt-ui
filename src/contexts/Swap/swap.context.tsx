import React, { useEffect, useState } from 'react';
import { WSOL } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useTokenListContext } from '../TokenList';
import { BLOCKED_POOLS_IDS } from './swap.constants';
import {
  PoolConfig,
  SwapContextInterface,
  SwapContextProviderProps,
} from './swap.model';
import { fetchPoolInfo, fetchRaydiumPools, swap } from './swap';
import { RawUserTokensByMint } from '../userTokens';

export const SwapContext = React.createContext<SwapContextInterface>({
  poolConfigs: [],
  fetchPoolInfo: () => Promise.resolve(null),
  swap: () => Promise.resolve(null),
  loading: true,
});

export const SwapContextProvider = ({
  children = null,
}: SwapContextProviderProps): JSX.Element => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [poolConfigs, setPoolConfigs] = useState<PoolConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { loading: tokenListLoading, swappableTokensMap } =
    useTokenListContext();

  const initilaizePools = async () => {
    try {
      setLoading(true);
      const pools = await fetchRaydiumPools();

      const poolConfigs = pools.filter(({ id, baseMint, quoteMint }) => {
        return (
          swappableTokensMap.has(baseMint) &&
          quoteMint === WSOL.mint &&
          !BLOCKED_POOLS_IDS.includes(id)
        );
      });

      setPoolConfigs(poolConfigs);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !tokenListLoading && initilaizePools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListLoading]);

  return (
    <SwapContext.Provider
      value={{
        loading,
        poolConfigs,
        fetchPoolInfo: (poolConfig: PoolConfig) =>
          fetchPoolInfo(connection, poolConfig),
        swap: (
          userTokensMap: RawUserTokensByMint,
          amount: BN,
          poolConfig: PoolConfig,
          isBuy: boolean,
        ) =>
          swap(
            connection,
            publicKey,
            signTransaction,
            userTokensMap,
            amount,
            poolConfig,
            isBuy,
          ),
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
