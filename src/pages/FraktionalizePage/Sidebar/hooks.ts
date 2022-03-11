import { useEffect, useMemo, useState } from 'react';
import { useHeaderState } from '../../../components/Layout/headerState';
import {
  SafetyBoxWithMetadata,
  useFraktion,
  VaultData,
  VaultState,
} from '../../../contexts/fraktion';
import { UserNFT } from '../../../contexts/userTokens';

export const useSidebar = (
  currentVaultPubkey: string,
  nfts: UserNFT[],
): {
  currentVault: VaultData;
  lockedNfts: SafetyBoxWithMetadata[];
  isSidebarVisible: boolean;
  isVaultActive: boolean;
  isBasket: boolean;
  isHeaderHidden: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
} => {
  const { vaults } = useFraktion();
  const { isHeaderHidden } = useHeaderState();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isBasket = nfts.length > 1;

  const currentVault = useMemo(
    () => vaults.find((el) => el.vaultPubkey === currentVaultPubkey),
    [currentVaultPubkey, vaults],
  );

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const lockedNfts = currentVault?.safetyBoxes || [];
  const isVaultActive = currentVault?.state === VaultState.Active;

  const isSidebarVisible = !!(nfts.length || lockedNfts?.length);

  useEffect(() => {
    if (!nfts.length) {
      setIsSidebarCollapsed(false);
    }
  }, [nfts.length]);

  return {
    currentVault,
    lockedNfts,
    isSidebarVisible,
    isVaultActive,
    isBasket,
    isHeaderHidden,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  };
};
