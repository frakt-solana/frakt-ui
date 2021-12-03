import { useContext } from 'react';

import { FraktionContext } from './fraktion.context';
import { FraktionContextType } from './fraktion.model';

export const useFraktion = (): FraktionContextType => {
  const {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  } = useContext(FraktionContext);
  return {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  };
};