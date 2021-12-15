import React, { useEffect, useState } from 'react';
import { LiquidityPoolKeysV4, WSOL } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useTokenListContext } from '../TokenList';
import { BLOCKED_POOLS_IDS } from './swap.constants';
import { SwapContextInterface, SwapContextProviderProps } from './swap.model';
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
  const [poolConfigs, setPoolConfigs] = useState<LiquidityPoolKeysV4[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { loading: tokenListLoading, swappableTokensMap } =
    useTokenListContext();

  const initilaizePools = async () => {
    try {
      setLoading(true);
      const pools = await fetchRaydiumPools(connection);

      const poolConfigs = pools.filter(({ id, baseMint, quoteMint }) => {
        return (
          swappableTokensMap.has(baseMint.toBase58()) &&
          quoteMint.toBase58() === WSOL.mint &&
          !BLOCKED_POOLS_IDS.includes(id.toBase58())
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
    !tokenListLoading && swappableTokensMap.size && initilaizePools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenListLoading, swappableTokensMap]);

  return (
    <SwapContext.Provider
      value={{
        loading,
        poolConfigs,
        fetchPoolInfo: (poolConfig: LiquidityPoolKeysV4) =>
          fetchPoolInfo(connection, poolConfig),
        swap: (
          userTokensMap: RawUserTokensByMint,
          amount: BN,
          minAmount: BN,
          poolConfig: LiquidityPoolKeysV4,
          isBuy: boolean,
        ) =>
          swap(
            connection,
            publicKey,
            signTransaction,
            userTokensMap,
            amount,
            minAmount,
            poolConfig,
            isBuy,
          ),
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
