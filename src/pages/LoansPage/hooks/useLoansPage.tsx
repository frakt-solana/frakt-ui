import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Tab, useTabs } from '../../../components/Tabs';
import { useDebounce } from '../../../hooks';
import {
  calcLoanPoolApr,
  calcLoanPoolReward,
  calcUtilizationRateInPercent,
  harvestLiquidity as harvestTxn,
  LoanWithArweaveMetadata,
  useLoans,
  useLoansInitialFetch,
  useLoansPolling,
} from '../../../contexts/loans';

export enum LoanTabsNames {
  LENDING = 'lending',
  LIQUIDATIONS = 'liquidations',
  LOANS = 'loans',
}

export interface LoansPoolData {
  apr?: number;
  userDeposit?: number;
  totalSupply?: number;
  userLoans?: number;
  utilizationRate?: number;
  loanPoolReward?: number;
}

export const useLoansPage = (): {
  loanTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  searchItems: (value?: string) => void;
  harvestLiquidity: () => void;
  userLoans: LoanWithArweaveMetadata[];
  userLoansLoading: boolean;
  loansPoolData: LoansPoolData;
} => {
  useLoansInitialFetch();
  useLoansPolling();

  const { userLoans, userLoansLoading, loanDataByPoolPublicKey } = useLoans();
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LOANS_TABS,
    defaultValue: LOANS_TABS[0].value,
  });
  const [, setSearchString] = useState<string>('');

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const currentPool = Array.from(loanDataByPoolPublicKey.values());

  const loansPoolData = currentPool.reduce((_, loanData) => {
    const currentUser = wallet.publicKey?.toBase58();

    if (loanData) {
      const { liquidityPool, loans, deposits } = loanData;

      const userLoans =
        loans
          .filter(({ user }) => user === currentUser)
          .filter(({ loanStatus }) => loanStatus === 'activated').length || 0;

      const userDeposit = deposits.find(({ user }) => user === currentUser);

      const amountUserDeposit = userDeposit?.amount / 1e9 || 0;

      const totalSupply = liquidityPool?.amountOfStaked / 1e9 || 0;

      const apr = calcLoanPoolApr(liquidityPool);

      const utilizationRate = calcUtilizationRateInPercent(liquidityPool);
      const loanPoolReward = calcLoanPoolReward(liquidityPool, userDeposit);

      return {
        apr,
        userLoans,
        totalSupply,
        userDeposit: amountUserDeposit,
        utilizationRate,
        loanPoolReward,
      };
    }
  }, {});

  const harvestLiquidity = async (): Promise<void> => {
    await harvestTxn({
      connection,
      wallet,
      liquidityPool: currentPool[0].liquidityPool.liquidityPoolPubkey,
    });
  };

  return {
    searchItems,
    loanTabs,
    tabValue,
    setTabValue,
    userLoans,
    userLoansLoading,
    loansPoolData,
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
