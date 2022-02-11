import { useEffect } from 'react';
import { Control, useForm } from 'react-hook-form';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { LiquidityPoolKeysV4, LiquiditySide } from '@raydium-io/raydium-sdk';

import {
  calculateTotalDeposit,
  useCurrentSolanaPrice,
} from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks/useLazyPoolInfo';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
  TOTAL_VALUE = 'totalValue',
  IS_VERIFIED = 'isVerified',
  LIQUIDITY_SIDE = 'liquiditySide',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.TOTAL_VALUE]: string;
  [InputControlsNames.IS_VERIFIED]: boolean;
  [InputControlsNames.LIQUIDITY_SIDE]: LiquiditySide;
};

export const useDeposit = (
  quoteToken: TokenInfo,
  poolConfig: LiquidityPoolKeysV4,
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isDepositBtnEnabled: boolean;
  handleChange: (value: string, name: InputControlsNames) => void;
  handleBlur: (value: LiquiditySide) => void;
  quoteValue: string;
  baseValue: string;
  currentSolanaPriceUSD: number;
  liquiditySide: LiquiditySide | null;
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
      [InputControlsNames.LIQUIDITY_SIDE]: null,
    },
  });

  const { isVerified, quoteValue, baseValue, totalValue, liquiditySide } =
    watch();

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

  const handleChange = (value: string, name: InputControlsNames) => {
    setValue(name, value);

    if (name === InputControlsNames.BASE_VALUE) {
      const { amountOut } = getOutputAmount({
        poolKeys: poolConfig,
        poolInfo,
        payToken: quoteToken,
        payAmount: Number(value),
        receiveToken: SOL_TOKEN,
      });

      setValue(InputControlsNames.QUOTE_VALUE, amountOut);
    } else {
      const { amountOut } = getOutputAmount({
        poolKeys: poolConfig,
        poolInfo,
        payToken: SOL_TOKEN,
        payAmount: Number(value),
        receiveToken: quoteToken,
      });

      setValue(InputControlsNames.BASE_VALUE, amountOut);
    }
  };

  const handleBlur = (value: LiquiditySide) => {
    setValue(InputControlsNames.LIQUIDITY_SIDE, value);
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
    handleBlur,
    quoteValue,
    baseValue,
    currentSolanaPriceUSD,
    liquiditySide,
  };
};
