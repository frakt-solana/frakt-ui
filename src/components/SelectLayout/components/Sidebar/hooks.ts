import { useEffect, useState } from 'react';

import { BorrowNft } from '../../../../state/loans/types';
import { useHeaderState } from '../../../Layout/headerState';

export const useSidebar = (
  nfts: BorrowNft[],
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
