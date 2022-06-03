import { useEffect, useState } from 'react';
import { useHeaderState } from '../../../Layout/headerState';
import { UserNFT } from '../../../../state/userTokens/types';

export const useSidebar = (
  nfts: UserNFT[],
): {
  isSidebarVisible: boolean;
  isHeaderHidden: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
} => {
  const { isHeaderHidden } = useHeaderState();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isSidebarVisible = !!nfts.length;

  useEffect(() => {
    if (!nfts.length) {
      setIsSidebarCollapsed(false);
    }
  }, [nfts.length]);

  return {
    isSidebarVisible,
    isHeaderHidden,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  };
};
