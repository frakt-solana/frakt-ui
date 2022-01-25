import React, { useEffect, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useTokenListContext } from '../TokenList';
import {
  fetchRaydiumPoolsInfo,
  provideRaydiumLiquidity,
  raydiumSwap,
} from './liquidityPools';
import { fetchPoolDataByMint } from './liquidityPools.helpers';
import {
  LiquidityPoolsContextValues,
  LiquidityPoolsProviderType,
  PoolDataByMint,
} from './liquidityPools.model';

export const LiquidityPoolsContext =
  React.createContext<LiquidityPoolsContextValues>({
    loading: true,
    poolDataByMint: new Map(),
    fetchRaydiumPoolsInfo: () => Promise.resolve(null),
    raydiumSwap: () => Promise.resolve(null),
    provideRaydiumLiquidity: () => Promise.resolve(null),
  });

export const LiquidityPoolsProvider: LiquidityPoolsProviderType = ({
  children,
}) => {
  const { fraktionTokensMap } = useTokenListContext();
  const { connection } = useConnection();
  const { publicKey: walletPublicKey, signTransaction } = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [poolDataByMint, setPoolDataByMint] = useState<PoolDataByMint>(
    new Map(),
  );

  const fetchPoolData = async (fraktionTokensMap: Map<string, TokenInfo>) => {
    try {
      const poolDataByMint = await fetchPoolDataByMint({
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
        fetchRaydiumPoolsInfo: fetchRaydiumPoolsInfo(connection),
        raydiumSwap: raydiumSwap(connection, walletPublicKey, signTransaction),
        provideRaydiumLiquidity: provideRaydiumLiquidity(
          connection,
          walletPublicKey,
          signTransaction,
        ),
      }}
    >
      {children}
    </LiquidityPoolsContext.Provider>
  );
};
