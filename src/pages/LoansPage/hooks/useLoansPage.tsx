import { useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Tab, useTabs } from '../../../components/Tabs';
import { ArrowDownSmallIcon } from '../../../icons';
import styles from '../LoansPage.module.scss';
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

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

export enum LoanTabsNames {
  LENDING = 'lending',
  LIQUIDATIONS = 'liquidations',
  LOANS = 'loans',
}

export type SortValue = {
  label: JSX.Element;
  value: string;
};

export type FormFieldValues = {
  [InputControlsNames.SHOW_STAKED]: boolean;
  [InputControlsNames.SORT]: SortValue;
};

export interface LoansPoolData {
  apr?: number;
  userDeposit?: number;
  totalSupply?: number;
  userLoans?: number;
  utilizationRate?: number;
  loanPoolReward?: number;
}

export const useLoansPage = (): {
  formControl: Control<FormFieldValues>;
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

  const { control } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_STAKED]: false,
      [InputControlsNames.SORT]: SORT_VALUES[0],
    },
  });
  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LOANS_TABS,
    defaultValue: LOANS_TABS[2].value,
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
        loans.filter(({ user }) => user === currentUser).length || 0;

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
    formControl: control,
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

export const SORT_VALUES: SortValue[] = [
  {
    label: (
      <span>
        Price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'price_desc',
  },
  {
    label: (
      <span>
        Price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'price_asc',
  },
];
