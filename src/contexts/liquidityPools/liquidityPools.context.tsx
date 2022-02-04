import React, { useEffect, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

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
import {
  fetchPoolDataByMint,
  fetchProgramAccounts,
} from './liquidityPools.helpers';
import {
  LiquidityPoolsContextValues,
  LiquidityPoolsProviderType,
  PoolDataByMint,
  ProgramAccountsData,
} from './liquidityPools.model';
import CONFIG from './config';

const { PROGRAM_PUBKEY } = CONFIG;

const IS_DEVNET = process.env.REACT_APP_NETWORK === 'devnet';

export const LiquidityPoolsContext =
  React.createContext<LiquidityPoolsContextValues>({
    loading: true,
    poolDataByMint: new Map(),
    programAccounts: {},
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
  const { fraktionTokensMap } = useTokenListContext();
  const { connection } = useConnection();
  const { publicKey: walletPublicKey, signTransaction } = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [poolDataByMint, setPoolDataByMint] = useState<PoolDataByMint>(
    new Map(),
  );

  const [programAccounts, setProgramAccounts] = useState<ProgramAccountsData>();

  const fetchPoolData = async (fraktionTokensMap: Map<string, TokenInfo>) => {
    try {
      if (IS_DEVNET) {
        const allProgramAccounts = await fetchProgramAccounts({
          vaultProgramId: new PublicKey(PROGRAM_PUBKEY),
          connection,
        });
        setProgramAccounts(allProgramAccounts);
      }

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
        programAccounts,
        fetchRaydiumPoolsInfo: fetchRaydiumPoolsInfo(connection),
        raydiumSwap: raydiumSwap(connection, walletPublicKey, signTransaction),
        createRaydiumLiquidityPool: createRaydiumLiquidityPool(
          connection,
          walletPublicKey,
          signTransaction,
        ),
        removeRaydiumLiquidity: removeRaydiumLiquidity(
          connection,
          walletPublicKey,
          signTransaction,
        ),
        addRaydiumLiquidity: addRaydiumLiquidity(
          connection,
          walletPublicKey,
          signTransaction,
        ),
        harvestLiquidity: harvestLiquidity(
          connection,
          walletPublicKey,
          signTransaction,
        ),
        stakeLiquidity: stakeLiquidity(
          connection,
          walletPublicKey,
          signTransaction,
        ),
        unstakeLiquidity: unstakeLiquidity(
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
