import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  fetchDataFunction,
  FraktionContextType,
  VaultData,
} from './fraktion.model';
import {
  buyout,
  createFraktionsMarket,
  fraktionalize,
  getVaults,
  redeem,
  createBasket,
} from './fraktion';
import { getMarkets } from '../../utils/markets';
import { usePolling } from '../../hooks';

export const FraktionContext = React.createContext<FraktionContextType>({
  loading: false,
  error: null,
  vaults: [],
  vaultsMarkets: [],
  fraktionalize: () => Promise.resolve(null),
  buyout: () => Promise.resolve(null),
  redeem: () => Promise.resolve(null),
  createFraktionsMarket: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
  createBasket: () => Promise.resolve(null),
  patchVault: () => {},
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const {
    publicKey: walletPublicKey,
    signTransaction,
    signAllTransactions,
  } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [vaultsMarkets, setVaultsMarkets] = useState([]);

  const fetchData: fetchDataFunction = async () => {
    try {
      setLoading(true);
      const markets = await getMarkets();
      const vaultsData = await getVaults(markets);

      setVaultsMarkets(markets);
      setVaults(vaultsData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const silentFetchData: fetchDataFunction = async () => {
    try {
      const markets = await getMarkets();
      const vaultsData = await getVaults(markets);
      setVaultsMarkets(markets);
      setVaults(vaultsData);
    } catch {} //eslint-disable-line
  };

  const { isPolling, startPolling, stopPolling } = usePolling(
    silentFetchData,
    10000,
  );

  const patchVault = (vaultInfo: VaultData): void => {
    setVaults((vaults) =>
      vaults.reduce((vaults, vault) => {
        if (vault.vaultPubkey === vaultInfo.vaultPubkey) {
          return [...vaults, vaultInfo];
        }
        return [...vaults, vault];
      }, []),
    );
  };

  useEffect(() => {
    if (connection) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  useEffect(() => {
    startPolling();
    return () => isPolling && stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FraktionContext.Provider
      value={{
        loading,
        error,
        vaults,
        vaultsMarkets,
        fraktionalize: (
          userNft,
          tickerName,
          pricePerFraction,
          fractionsAmount,
          token,
        ) =>
          fraktionalize(
            userNft,
            tickerName,
            pricePerFraction,
            fractionsAmount,
            token,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        createBasket: (userNfts, existsVaultPubkey) =>
          createBasket(
            userNfts,
            existsVaultPubkey,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        buyout: (vault, userTokensByMint) =>
          buyout(
            vault,
            userTokensByMint,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        redeem: (vault) =>
          redeem(vault, walletPublicKey, signTransaction, connection),
        createFraktionsMarket: (fractionsMintAddress, tickerName) =>
          createFraktionsMarket(
            fractionsMintAddress,
            tickerName,
            walletPublicKey,
            signAllTransactions,
            connection,
          ),
        refetch: fetchData,
        patchVault,
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};
