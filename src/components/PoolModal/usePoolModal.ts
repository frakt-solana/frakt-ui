import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { Control, useForm } from 'react-hook-form';
import {
  depositLiquidity as depositTxn,
  unstakeLiquidity as unstakeTxn,
} from '../../contexts/loans';
import { Tab, useTabs } from '../Tabs';

export enum InputControlsNames {
  DEPOSIT_VALUE = 'depositValue',
  WITHDRAW_VALUE = 'withdrawValue',
}

export enum TabsNames {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormFieldValues = {
  [InputControlsNames.DEPOSIT_VALUE]: number;
  [InputControlsNames.WITHDRAW_VALUE]: number;
};

export const usePoolModal = (): {
  depositValue: number;
  withdrawValue: number;
  depositLiquidity: () => void;
  unstakeLiquidity: () => void;
  formControl: Control<FormFieldValues>;
  poolTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
} => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { control, watch, register } = useForm({
    defaultValues: {
      [InputControlsNames.DEPOSIT_VALUE]: 0,
      [InputControlsNames.WITHDRAW_VALUE]: 0,
    },
  });

  const { depositValue, withdrawValue } = watch();

  const {
    tabs: poolTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: POOLS_TABS,
    defaultValue: POOLS_TABS[0].value,
  });

  const liquidityPool = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';

  useEffect(() => {
    register(InputControlsNames.DEPOSIT_VALUE);
    register(InputControlsNames.WITHDRAW_VALUE);
  }, [register]);

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
    formControl: control,
    depositValue,
    withdrawValue,
    depositLiquidity,
    unstakeLiquidity,
    poolTabs,
    tabValue,
    setTabValue,
  };
};

const POOLS_TABS = [
  {
    label: 'Deposit',
    value: 'deposit',
  },
  {
    label: 'Withdraw',
    value: 'withdraw',
  },
];
