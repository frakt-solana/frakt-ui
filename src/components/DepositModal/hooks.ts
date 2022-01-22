import { TokenInfo } from '@solana/spl-token-registry';
import { useEffect, useMemo, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { calculateTotalDeposit } from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks';

export enum InputControlsNames {
  QUOTE_VALUE = 'baseValue',
  BASE_VALUE = 'quoteValue',
  IS_VERIFY = 'isVerify',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.IS_VERIFY]: boolean;
};

export const useHandleSwap = (
  quoteToken: TokenInfo,
  currentSolanaPriceUSD: number,
): {
  formControl: Control<FormFieldValues>;
  quoteValue: string;
  totalValue: string;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();

  console.log(poolInfo);
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '0',
      [InputControlsNames.BASE_VALUE]: '0',
      [InputControlsNames.IS_VERIFY]: false,
    },
  });

  const [quoteValue, setQuoteValue] = useState<string>('');
  const [totalValue, setTotalValue] = useState<string>('');
  // const [baseValue, setBaseValue] = useState<string>('');

  const baseAmount = watch(InputControlsNames.BASE_VALUE);
  const quoteAmount = watch(InputControlsNames.QUOTE_VALUE);

  useEffect(() => {
    if (SOL_TOKEN && quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SOL_TOKEN, quoteToken]);

  useEffect(() => {
    if (poolInfo && SOL_TOKEN !== quoteToken) {
      setQuoteValue(getOutputAmount(baseAmount, poolInfo, true));
    }
  }, [baseAmount, currentSolanaPriceUSD]);

  useEffect(() => {
    setTotalValue(
      calculateTotalDeposit(baseAmount, quoteValue, currentSolanaPriceUSD),
    );
  }, [baseAmount, quoteValue, currentSolanaPriceUSD]);

  return {
    formControl: control,
    quoteValue,
    totalValue,
  };
};
