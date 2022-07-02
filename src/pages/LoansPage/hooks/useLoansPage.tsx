import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { harvestLiquidity as harvestTxn } from '../../../utils/loans';
import { useConnection, useDebounce } from '../../../hooks';
import { Tab, useTabs } from '../../../components/Tabs';

export enum LoanTabsNames {
  LENDING = 'lending',
  LIQUIDATIONS = 'liquidations',
  LOANS = 'loans',
}

export interface LoansPoolInfo {
  apr?: number;
  loans?: number;
  totalSupply?: number;
  depositAmount?: number;
  utilizationRate?: number;
  rewardAmount?: number;
  totalBorrowed?: number;
}

export const useLoansPage = (): {
  loanTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  searchItems: (value?: string) => void;
  harvestLiquidity: (liquidityPool: string) => void;
  search: string;
  setSearch?: (value?: string) => void;
} => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LOANS_TABS,
    defaultValue: LOANS_TABS[0].value,
  });
  const [search, setSearch] = useState<string>('');

  const searchItems = useDebounce((search: string) => {
    setSearch(search.toUpperCase());
  }, 300);

  const harvestLiquidity = async (liquidityPool: string): Promise<void> => {
    await harvestTxn({
      connection,
      wallet,
      liquidityPool,
    });
  };

  return {
    search,
    searchItems,
    setSearch,
    loanTabs,
    tabValue,
    setTabValue,
    harvestLiquidity,
  };
};

const LOANS_TABS: Tab[] = [
  {
    label: 'Lending',
    value: 'lending',
  },
  {
    label: 'Liquidations',
    value: 'liquidations',
    disabled: true,
  },
  {
    label: 'My loans',
    value: 'loans',
  },
];
