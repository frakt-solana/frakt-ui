import { useConnection } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { useTokenListContext } from '../TokenList';
import {
  fetchRaydiumPoolsConfigs,
  fetchRaydiumPoolsInfoMap,
  getFraktionPoolConfigs,
  getPools,
} from './liquidityPools.helpers';
import {
  LiquidityPoolsContextValues,
  LiquidityPoolsProviderType,
} from './liquidityPools.model';

export const LiquidityPoolsContext =
  React.createContext<LiquidityPoolsContextValues>({
    liquidityPools: [],
    loading: true,
  });

export const LiquidityPoolsProvider: LiquidityPoolsProviderType = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const { fraktionTokensMap } = useTokenListContext();

  const { connection } = useConnection();

  const fetchPools = async () => {
    try {
      const configs = await fetchRaydiumPoolsConfigs(connection);

      const poolConfigs = getFraktionPoolConfigs(configs, fraktionTokensMap);

      const poolsInfoMap = await fetchRaydiumPoolsInfoMap(
        connection,
        poolConfigs,
      );

      const pools = getPools(poolConfigs, poolsInfoMap, fraktionTokensMap);

      console.log(pools);

      // console.log(poolConfigs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fraktionTokensMap.size && fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraktionTokensMap.size]);

  return (
    <LiquidityPoolsContext.Provider value={{ liquidityPools: [], loading }}>
      {children}
    </LiquidityPoolsContext.Provider>
  );
};
