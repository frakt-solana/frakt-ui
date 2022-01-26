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
import { useLazyPoolInfo } from '../SwapForm/hooks/useLazyPoolInfo';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
  TOTAL_VALUE = 'totalValue',
  IS_VERIFIED = 'isVerified',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.TOTAL_VALUE]: string;
  [InputControlsNames.IS_VERIFIED]: boolean;
};

export const useDeposit = (
  quoteToken: TokenInfo,
  poolConfig: LiquidityPoolKeysV4,
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isDepositBtnEnabled: boolean;
  handleChange: (value: string, name) => void;
  quoteValue: string;
  baseValue: string;
  currentSolanaPriceUSD: number;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const { connected } = useWallet();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '',
      [InputControlsNames.BASE_VALUE]: '',
      [InputControlsNames.TOTAL_VALUE]: '',
      [InputControlsNames.IS_VERIFIED]: false,
    },
  });

  const { isVerified, quoteValue, baseValue, totalValue } = watch();

  useEffect(() => {
    register(InputControlsNames.QUOTE_VALUE);
    register(InputControlsNames.BASE_VALUE);
    register(InputControlsNames.TOTAL_VALUE);
  }, [register]);

  useEffect(() => {
    if (quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteToken]);

  const handleChange = (value: string, name) => {
    setValue(name, value);

    if (name === InputControlsNames.BASE_VALUE) {
      setValue(
        InputControlsNames.QUOTE_VALUE,
        getOutputAmount(
          poolConfig,
          poolInfo,
          SOL_TOKEN,
          Number(value),
          quoteToken,
        ),
      );
    } else {
      setValue(
        InputControlsNames.BASE_VALUE,
        getOutputAmount(
          poolConfig,
          poolInfo,
          quoteToken,
          Number(value),
          SOL_TOKEN,
        ),
      );
    }
  };

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calculateTotalDeposit(quoteValue, baseValue, currentSolanaPriceUSD),
    );
  }, [baseValue, quoteValue, currentSolanaPriceUSD, setValue]);

  const isDepositBtnEnabled =
    poolInfo && connected && isVerified && Number(baseValue) > 0;

  return {
    formControl: control,
    totalValue,
    isDepositBtnEnabled,
    handleChange,
    quoteValue,
    baseValue,
    currentSolanaPriceUSD,
  };
};
