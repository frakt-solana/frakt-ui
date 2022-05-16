import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import { Prism } from '@prism-hq/prism-ag';

import { useTokenListContext } from '../TokenList';
import {
  fetchRaydiumPoolsInfo,
  addRaydiumLiquidity,
  removeRaydiumLiquidity,
  raydiumSwap,
  harvestLiquidity,
  stakeLiquidity,
  unstakeLiquidity,
  createRaydiumLiquidityPool,
} from './liquidityPools';
import { fetchPoolDataByMint } from './liquidityPools.helpers';
import {
  LiquidityPoolsContextValues,
  LiquidityPoolsProviderType,
  PoolDataByMint,
} from './liquidityPools.model';
import { prismSwap } from './transactions/prisma';

export const LiquidityPoolsContext =
  React.createContext<LiquidityPoolsContextValues>({
    loading: true,
    poolDataByMint: new Map(),
    fetchRaydiumPoolsInfo: () => Promise.resolve(null),
    raydiumSwap: () => Promise.resolve(null),
    prismSwap: () => Promise.resolve(null),
    createRaydiumLiquidityPool: () => Promise.resolve(null),
    addRaydiumLiquidity: () => Promise.resolve(null),
    removeRaydiumLiquidity: () => Promise.resolve(null),
    harvestLiquidity: () => Promise.resolve(null),
    stakeLiquidity: () => Promise.resolve(null),
    unstakeLiquidity: () => Promise.resolve(null),
    prism: null,
  });

export const LiquidityPoolsProvider: LiquidityPoolsProviderType = ({
  children,
}) => {
  const { fraktionTokensMap } = useTokenListContext();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPrism, setLoadingPrism] = useState<boolean>(true);
  const [poolDataByMint, setPoolDataByMint] = useState<PoolDataByMint>(
    new Map(),
  );
  const { tokensList, loading: tokensListLoading } = useTokenListContext();

  const [prism, setPrism] = useState<any>();

  const fetchPoolData = async (fraktionTokensMap: Map<string, TokenInfo>) => {
    try {
      const poolDataByMint = await fetchPoolDataByMint({
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

  const fetchPrismaData = async () => {
    try {
      const initPrism = async () => {
        return await Prism.init({
          user: wallet.publicKey,
          connection: connection,
          tokenList: { tokens: tokensList },
        });
      };

      const prism = await initPrism();
      setPrism(prism);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoadingPrism(false);
    }
  };

  useEffect(() => {
    fraktionTokensMap.size && fetchPoolData(fraktionTokensMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraktionTokensMap.size]);

  useEffect(() => {
    if (wallet.connected && !tokensListLoading) {
      fetchPrismaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected, tokensListLoading]);

  return (
    <LiquidityPoolsContext.Provider
      value={{
        loading: loadingPrism && loading,
        prism,
        poolDataByMint,
        fetchRaydiumPoolsInfo: fetchRaydiumPoolsInfo(connection),
        raydiumSwap: raydiumSwap({
          connection,
          wallet,
        }),
        prismSwap: prismSwap({
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
