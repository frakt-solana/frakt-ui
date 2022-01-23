import { useEffect } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import {
  calculateTotalDeposit,
  useCurrentSolanaPrice,
} from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
  TOTAL_VALUE = 'totalValue',
  IS_VERIFY = 'isVerify',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.TOTAL_VALUE]: string;
  [InputControlsNames.IS_VERIFY]: boolean;
};

export const useDeposit = (
  quoteToken: TokenInfo,
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isDepositBtnEnabled: boolean;
  handleChange: (e: string, name) => void;
  totalChange: (e: string, name) => void;
  quoteValue: string;
  baseValue: string;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { connected } = useWallet();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '',
      [InputControlsNames.BASE_VALUE]: '',
      [InputControlsNames.TOTAL_VALUE]: '',
      [InputControlsNames.IS_VERIFY]: false,
    },
  });

  const { isVerify, quoteValue, baseValue, totalValue } = watch();

  useEffect(() => {
    register(InputControlsNames.QUOTE_VALUE);
    register(InputControlsNames.BASE_VALUE);
    register(InputControlsNames.TOTAL_VALUE);
  }, [register]);

  useEffect(() => {
    if (SOL_TOKEN && quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SOL_TOKEN, quoteToken]);

  const handleChange = (value: string, name) => {
    setValue(name, value);

    if (name === InputControlsNames.QUOTE_VALUE) {
      setValue(
        InputControlsNames.BASE_VALUE,
        getOutputAmount(value, poolInfo, false),
      );
    } else {
      setValue(
        InputControlsNames.QUOTE_VALUE,
        getOutputAmount(value, poolInfo, true),
      );
    }
  };

  const totalChange = (value: string, name) => {
    setValue(name, value);

    // TO DO calc quote token amount

    // const halfTotalValue = Number(value) / 2;
    // const baseTotalValue = String(halfTotalValue / currentSolanaPriceUSD);

    // setValue(InputControlsNames.BASE_VALUE, baseTotalValue);
  };

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calculateTotalDeposit(baseValue, quoteValue, currentSolanaPriceUSD),
    );
  }, [baseValue, quoteValue, currentSolanaPriceUSD, setValue]);

  const isDepositBtnEnabled =
    poolInfo && connected && isVerify && Number(baseValue) > 0;

  return {
    formControl: control,
    totalValue,
    isDepositBtnEnabled,
    handleChange,
    quoteValue,
    baseValue,
    totalChange,
  };
};
