import { useMemo, useState } from 'react';
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
  harvestLiquidity: () => void;
  userLoans: LoanWithArweaveMetadata[];
  userLoansLoading: boolean;
  loansPoolInfo: LoansPoolInfo;
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

  const LOAN_POOL_PUBKEY = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const loansPoolInfo = useMemo((): LoansPoolInfo => {
    const currentUser = wallet.publicKey?.toBase58();

    const loansInfo = loanDataByPoolPublicKey.get(LOAN_POOL_PUBKEY);

    if (loansInfo) {
      const { liquidityPool, loans, deposits } = loansInfo;

      const apr = calcLoanPoolApr(liquidityPool);

      const activeUserLoans = loans
        .filter(({ user }) => user === currentUser)
        .filter(({ loanStatus }) => loanStatus === 'activated');

      const depositAccount = deposits.find(({ user }) => user === currentUser);

      const totalBorrowed =
        liquidityPool?.amountOfStaked - liquidityPool?.liquidityAmount;

      const utilizationRate = calcUtilizationRateInPercent(liquidityPool);
      const rewardAmount = calcLoanPoolReward(liquidityPool, depositAccount);

      return {
        apr,
        loans: activeUserLoans.length || 0,
        totalSupply: liquidityPool?.amountOfStaked / 1e9 || 0,
        depositAmount: depositAccount?.amount / 1e9 || 0,
        totalBorrowed: totalBorrowed / 1e9 || 0,
        utilizationRate,
        rewardAmount,
      };
    }
  }, [loanDataByPoolPublicKey, wallet]);

  const harvestLiquidity = async (): Promise<void> => {
    await harvestTxn({
      connection,
      wallet,
      liquidityPool: LOAN_POOL_PUBKEY,
    });
  };

  return {
    searchItems,
    loanTabs,
    tabValue,
    setTabValue,
    userLoans,
    userLoansLoading,
    loansPoolInfo,
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
