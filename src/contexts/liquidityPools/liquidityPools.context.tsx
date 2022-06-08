import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { pools, swaps } from '@frakt-protocol/frakt-sdk';

import { selectTokenListState } from '../../state/tokenList/selectors';
import {
  addRaydiumLiquidity,
  removeRaydiumLiquidity,
  raydiumSwap,
  harvestLiquidity,
  stakeLiquidity,
  unstakeLiquidity,
  createRaydiumLiquidityPool,
} from './liquidityPools';
import {
  LiquidityPoolsContextValues,
  LiquidityPoolsProviderType,
  PoolDataByMint,
} from './liquidityPools.model';
import { useConnection } from '../../hooks';

export const LiquidityPoolsContext =
  React.createContext<LiquidityPoolsContextValues>({
    loading: true,
    poolDataByMint: new Map(),
    fetchRaydiumPoolsInfo: () => Promise.resolve(null),
    raydiumSwap: () => Promise.resolve(null),
    createRaydiumLiquidityPool: () => Promise.resolve(null),
    addRaydiumLiquidity: () => Promise.resolve(null),
    removeRaydiumLiquidity: () => Promise.resolve(null),
    harvestLiquidity: () => Promise.resolve(null),
    stakeLiquidity: () => Promise.resolve(null),
    unstakeLiquidity: () => Promise.resolve(null),
  });

export const LiquidityPoolsProvider: LiquidityPoolsProviderType = ({
  children,
}) => {
  const { fraktionTokensMap } = useSelector(selectTokenListState);
  const connection = useConnection();
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [poolDataByMint, setPoolDataByMint] = useState<PoolDataByMint>(
    new Map(),
  );

  const fetchPoolData = async (fraktionTokensMap: Map<string, TokenInfo>) => {
    try {
      const poolDataByMint = await pools.fetchPoolDataByMint({
        connection,
        tokensMap: fraktionTokensMap,
      });

      setPoolDataByMint(poolDataByMint);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fraktionTokensMap.size && fetchPoolData(fraktionTokensMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraktionTokensMap.size]);

  return (
    <LiquidityPoolsContext.Provider
      value={{
        loading,
        poolDataByMint,
        fetchRaydiumPoolsInfo: swaps.fetchRaydiumPoolsInfo(connection),
        raydiumSwap: raydiumSwap({
          connection,
          wallet,
        }),
        createRaydiumLiquidityPool: createRaydiumLiquidityPool({
          connection,
          wallet,
        }),
        removeRaydiumLiquidity: removeRaydiumLiquidity({
          connection,
          wallet,
        }),
        addRaydiumLiquidity: addRaydiumLiquidity({
          connection,
          wallet,
        }),
        harvestLiquidity: harvestLiquidity({
          connection,
          wallet,
        }),
        stakeLiquidity: stakeLiquidity({
          connection,
          wallet,
        }),
        unstakeLiquidity: unstakeLiquidity({
          connection,
          wallet,
        }),
      }}
    >
      {children}
    </LiquidityPoolsContext.Provider>
  );
};
