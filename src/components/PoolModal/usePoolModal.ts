import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';

import { useNativeAccount } from '../../utils/accounts';
import { getCorrectSolWalletBalance, getSolBalanceValue } from '../../utils';
import { Tab, useTabs } from '../Tabs';
import {
  depositLiquidity as depositTxn,
  unstakeLiquidity as unstakeTxn,
} from '../../utils/loans';
import { useConnection } from '../../hooks';

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
  liquidityPoolPubkey: string,
  visible: string,
  depositAmount: number,
  onCancel: () => void,
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
  const wallet = useWallet();
  const connection = useConnection();
  const { watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.DEPOSIT_VALUE]: '',
      [InputControlsNames.WITHDRAW_VALUE]: '',
      [InputControlsNames.PERCENT_VALUE]: 0,
    },
  });

  const { account } = useNativeAccount();
  const solBalanceValue = getSolBalanceValue(account);
  const solWalletBalance = getCorrectSolWalletBalance(solBalanceValue);

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
    caclPercentOfBalance(nextValue, depositAmount);
  };

  const caclPercentOfBalance = (
    nextValue: string,
    balance: string | number,
  ): void => {
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
      liquidityPool: liquidityPoolPubkey,
      amount,
    });

    onCancel();
  };

  const unstakeLiquidity = async (): Promise<void> => {
    const amount = Number(withdrawValue) * 1e9;

    await unstakeTxn({
      connection,
      wallet,
      liquidityPool: liquidityPoolPubkey,
      amount,
    });

    onCancel();
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

export const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};
