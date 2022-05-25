import { useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';

import { useNativeAccount } from '../../utils/accounts';
import { getSolBalanceValue } from '../../utils';
import { Tab, useTabs } from '../Tabs';
import {
  depositLiquidity as depositTxn,
  unstakeLiquidity as unstakeTxn,
} from '../../contexts/loans';

export enum InputControlsNames {
  DEPOSIT_VALUE = 'depositValue',
  WITHDRAW_VALUE = 'withdrawValue',
  PERCENT_VALUE = 'percentValue',
}

export enum TabsNames {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormFieldValues = {
  [InputControlsNames.DEPOSIT_VALUE]: string;
  [InputControlsNames.WITHDRAW_VALUE]: string;
  [InputControlsNames.PERCENT_VALUE]: number;
};

export const usePoolModal = (
  visible: string,
  depositAmount: number,
): {
  depositValue: string;
  withdrawValue: string;
  depositLiquidity: () => void;
  unstakeLiquidity: () => void;
  poolTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  onDepositValueChange: (nextValue: string) => void;
  onWithdrawValueChange: (nextValue: string) => void;
  onDepositPercentChange: (nextValue: number) => void;
  onWithdrawPercentChange: (nextValue: number) => void;
  percentValue: number;
  solWalletBalance: string;
} => {
  const liquidityPool = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';
  const wallet = useWallet();
  const { connection } = useConnection();
  const { watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.DEPOSIT_VALUE]: '',
      [InputControlsNames.WITHDRAW_VALUE]: '',
      [InputControlsNames.PERCENT_VALUE]: 0,
    },
  });

  const { account } = useNativeAccount();
  const solWalletBalance = getSolBalanceValue(account);

  const { depositValue, withdrawValue, percentValue } = watch();

  const POOLS_TABS = [
    {
      label: 'Deposit',
      value: 'deposit',
    },
    {
      label: 'Withdraw',
      value: 'withdraw',
      disabled: !depositAmount,
    },
  ];

  const {
    tabs: poolTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({ tabs: POOLS_TABS });

  useEffect(() => {
    setTabValue(visible);
  }, [visible, setTabValue]);

  useEffect(() => {
    setValue(InputControlsNames.PERCENT_VALUE, 0);
    setValue(InputControlsNames.WITHDRAW_VALUE, '');
    setValue(InputControlsNames.DEPOSIT_VALUE, '');
  }, [tabValue, setValue]);

  useEffect(() => {
    register(InputControlsNames.DEPOSIT_VALUE);
    register(InputControlsNames.WITHDRAW_VALUE);
    register(InputControlsNames.PERCENT_VALUE);
  }, [register]);

  const onDepositPercentChange = (nextValue: number): void => {
    const depositValue = calcValueByBalance(nextValue, solWalletBalance);

    setValue(InputControlsNames.DEPOSIT_VALUE, depositValue);
    setValue(InputControlsNames.PERCENT_VALUE, nextValue);
  };

  const onWithdrawPercentChange = (nextValue: number): void => {
    const withdrawValue = calcValueByBalance(nextValue, depositAmount);

    setValue(InputControlsNames.WITHDRAW_VALUE, withdrawValue);
    setValue(InputControlsNames.PERCENT_VALUE, nextValue);
  };

  const onDepositValueChange = (nextValue: string): void => {
    setValue(InputControlsNames.DEPOSIT_VALUE, nextValue);
    caclPercentOfBalance(nextValue, solWalletBalance);
  };

  const onWithdrawValueChange = (nextValue: string): void => {
    setValue(InputControlsNames.WITHDRAW_VALUE, nextValue);
    caclPercentOfBalance(nextValue, depositValue);
  };

  const caclPercentOfBalance = (nextValue: string, balance: string): void => {
    const percentOfBalance = (parseFloat(nextValue) / Number(balance)) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      setValue(InputControlsNames.PERCENT_VALUE, percentOfBalance);
    } else if (percentOfBalance > 100) {
      setValue(InputControlsNames.PERCENT_VALUE, 100);
    } else {
      setValue(InputControlsNames.PERCENT_VALUE, 0);
    }
  };

  const calcValueByBalance = (
    nextValue: number,
    balance: string | number,
  ): string => {
    const value = (nextValue * Number(balance)) / 100;
    return value ? value?.toFixed(2) : '0';
  };

  const depositLiquidity = async (): Promise<void> => {
    const amount = Number(depositValue) * 1e9;

    await depositTxn({
      connection,
      wallet,
      liquidityPool,
      amount,
    });
  };

  const unstakeLiquidity = async (): Promise<void> => {
    const amount = Number(withdrawValue) * 1e9;

    await unstakeTxn({
      connection,
      wallet,
      liquidityPool,
      amount,
    });
  };

  return {
    depositValue,
    withdrawValue,
    depositLiquidity,
    unstakeLiquidity,
    poolTabs,
    tabValue,
    setTabValue,
    percentValue,
    onDepositValueChange,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    onDepositPercentChange,
    solWalletBalance,
  };
};
