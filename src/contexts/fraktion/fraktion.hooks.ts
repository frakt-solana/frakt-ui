import { useContext } from 'react';

import { FraktionContext } from './fraktion.context';
import { FraktionContextType } from './fraktion.model';

export const useFraktion = (): FraktionContextType => {
  const {
    loading,
    error,
    vaults,
    vaultsMarkets,
    createVault,
    createMarket,
    refetch: fetchVaults,
    patchVault,
    isPolling,
    startPolling,
    stopPolling,
  } = useContext(FraktionContext);
  return {
    loading,
    error,
    vaults,
    vaultsMarkets,
    createVault,
    createMarket,
    refetch: fetchVaults,
    patchVault,
    isPolling,
    startPolling,
    stopPolling,
  };
};
