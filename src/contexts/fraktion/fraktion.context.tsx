import React, { useContext, useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { PublicKey } from '@solana/web3.js';
import { getAllVaults } from 'fraktionalizer-client-library';

import { useWallet } from '../../external/contexts/wallet';
import { useConnection } from '../../external/contexts/connection';
import {
  fetchVaultsFunction,
  FraktionContextType,
  SafetyBox,
  VaultsMap,
} from './fraktion.model';
import { fraktionalize } from './fraktion';
import fraktionConfig from './config';

const FraktionContext = React.createContext<FraktionContextType>({
  loading: false,
  error: null,
  safetyBoxes: [],
  vaultsMap: {},
  fraktionalize: () => Promise.resolve(null),
  fetchVaults: () => Promise.resolve(null),
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { wallet } = useWallet();
  const connection = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [safetyBoxes, setSafetyBoxes] = useState<SafetyBox[]>([]);
  const [vaultsMap, setVaultsMap] = useState<VaultsMap>({});

  const fetchVaults: fetchVaultsFunction = async () => {
    try {
      setLoading(true);
      const { safetyBoxes: rawSafetyBoxes, vaults: rawVaults } =
        await getAllVaults(
          new PublicKey(fraktionConfig.FRAKTION_PUBKEY),
          connection,
        );

      const safetyBoxes = rawSafetyBoxes as SafetyBox[];
      const vaults = keyBy(rawVaults, 'vaultPubkey') as VaultsMap;

      setSafetyBoxes(safetyBoxes);
      setVaultsMap(vaults);

      return { vaults, safetyBoxes };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connection && fetchVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <FraktionContext.Provider
      value={{
        loading,
        error,
        safetyBoxes,
        vaultsMap,
        fraktionalize: (tokenMint, pricePerFraction, fractionsAmount, token) =>
          fraktionalize(
            tokenMint,
            pricePerFraction,
            fractionsAmount,
            token,
            wallet,
            connection,
          ),
        fetchVaults,
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};

export const useFraktion = (): FraktionContextType => {
  const { loading, error, safetyBoxes, vaultsMap, fraktionalize, fetchVaults } =
    useContext(FraktionContext);
  return {
    loading,
    error,
    safetyBoxes,
    vaultsMap,
    fraktionalize,
    fetchVaults,
  };
};
