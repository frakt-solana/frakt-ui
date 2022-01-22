import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { calculateTotalDeposit } from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
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
  totalValue: string;
  quoteValue: string;
  baseValue: string;
  isDepositBtnEnabled: boolean;
  handleQuoteSwap: (event) => void;
  handleBaseSwap: (event) => void;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { connected } = useWallet();
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '',
      [InputControlsNames.BASE_VALUE]: '',
      [InputControlsNames.IS_VERIFY]: false,
    },
  });

  const [quoteValue, setQuoteValue] = useState<string>('');
  const [totalValue, setTotalValue] = useState<string>('');
  const [baseValue, setBaseValue] = useState<string>('');

  const isVerify = watch(InputControlsNames.IS_VERIFY);

  const isDepositBtnEnabled =
    poolInfo && connected && isVerify && Number(baseValue) > 0;

  useEffect(() => {
    if (SOL_TOKEN && quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SOL_TOKEN, quoteToken]);

  const handleBaseSwap = (event) => {
    if (event === '' || !event) {
      setQuoteValue('');
      setBaseValue(event);
      return;
    }
    setBaseValue(event);
    if (poolInfo && SOL_TOKEN !== quoteToken) {
      setQuoteValue(getOutputAmount(event, poolInfo, true));
    }
  };

  const handleQuoteSwap = (event) => {
    if (event === '' || !event) {
      setBaseValue('');
      setQuoteValue(event);
      return;
    }
    setQuoteValue(event);
    if (poolInfo && SOL_TOKEN !== quoteToken) {
      setBaseValue(getOutputAmount(event, poolInfo, false));
    }
  };

  useEffect(() => {
    setTotalValue(
      calculateTotalDeposit(baseValue, quoteValue, currentSolanaPriceUSD),
    );
  }, [baseValue, quoteValue, currentSolanaPriceUSD]);

  return {
    formControl: control,
    totalValue,
    isDepositBtnEnabled,
    quoteValue,
    baseValue,
    handleBaseSwap,
    handleQuoteSwap,
  };
};
