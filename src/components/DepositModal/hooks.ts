import { useEffect, useRef } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import {
  calculateTotalDeposit,
  useCurrentSolanaPrice,
  useLiquidityPools,
} from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
  TOTAL_VALUE = 'totalValue',
  IS_VERIFIED = 'isVerified',
  RECEIVE_TOKEN = 'receiveToken',
  RECEIVE_VALUE = 'receiveValue',
  PAY_TOKEN = 'payToken',
  PAY_VALUE = 'payValue',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.TOTAL_VALUE]: string;
  [InputControlsNames.IS_VERIFIED]: boolean;
  [InputControlsNames.RECEIVE_TOKEN]: TokenInfo;
  [InputControlsNames.RECEIVE_VALUE]: string;
  [InputControlsNames.PAY_TOKEN]: TokenInfo;
  [InputControlsNames.PAY_VALUE]: string;
};

export const useDeposit = (
  quoteToken?: TokenInfo,
  defaultTokenMint?: string,
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isDepositBtnEnabled: boolean;
  handleChange: (value: string, name) => void;
  onPayTokenChange: (nextToken: TokenInfo) => void;
  onReceiveTokenChange;
  changeSides: () => void;
  quoteValue: string;
  baseValue: string;
  currentSolanaPriceUSD: number;
  isSwapBtnEnabled: boolean;
  receiveToken: TokenInfo;
  payToken: TokenInfo;
  payValue: string;
  receiveValue: string;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { poolDataByMint } = useLiquidityPools();

  const { connected } = useWallet();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '',
      [InputControlsNames.BASE_VALUE]: '',
      [InputControlsNames.TOTAL_VALUE]: '',
      [InputControlsNames.IS_VERIFIED]: false,
      [InputControlsNames.RECEIVE_TOKEN]:
        poolDataByMint.get(defaultTokenMint)?.tokenInfo || null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_VALUE]: '',
    },
  });

  const {
    isVerified,
    quoteValue,
    baseValue,
    totalValue,
    receiveToken,
    payValue,
    payToken,
    receiveValue,
  } = watch();

  useEffect(() => {
    register(InputControlsNames.QUOTE_VALUE);
    register(InputControlsNames.BASE_VALUE);
    register(InputControlsNames.TOTAL_VALUE);
    register(InputControlsNames.PAY_VALUE);
    register(InputControlsNames.RECEIVE_VALUE);
  }, [register]);

  useEffect(() => {
    if (quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteToken]);

  const onPayTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      receiveToken?.address !== SOL_TOKEN.address
    ) {
      setValue(InputControlsNames.RECEIVE_TOKEN, SOL_TOKEN);
    }
    setValue(InputControlsNames.PAY_VALUE, '');
    setValue(InputControlsNames.PAY_TOKEN, nextToken);
  };

  const onReceiveTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      payToken?.address !== SOL_TOKEN.address
    ) {
      setValue(InputControlsNames.PAY_TOKEN, SOL_TOKEN);
    }
    setValue(InputControlsNames.RECEIVE_VALUE, '');
    setValue(InputControlsNames.RECEIVE_TOKEN, nextToken);
  };

  const changeSides = () => {
    const payValueBuf = payValue;
    const payTokenBuf = payToken;

    setValue(InputControlsNames.PAY_VALUE, receiveValue);
    setValue(InputControlsNames.PAY_TOKEN, receiveToken);
    setValue(InputControlsNames.RECEIVE_VALUE, payValueBuf);
    setValue(InputControlsNames.RECEIVE_TOKEN, payTokenBuf);
  };

  const intervalRef = useRef<any>();

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      intervalRef.current = setInterval(() => {
        fetchPoolInfo(payToken.address, receiveToken.address);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const handleChange = (value: string, name) => {
    setValue(name, value);

    if (poolInfo && payToken !== receiveToken) {
      switch (name) {
        case InputControlsNames.PAY_VALUE:
          setValue(
            InputControlsNames.RECEIVE_VALUE,
            getOutputAmount(
              value,
              poolInfo,
              payToken.address === SOL_TOKEN.address,
            ),
          );
          break;
        case InputControlsNames.QUOTE_VALUE:
          setValue(
            InputControlsNames.BASE_VALUE,
            getOutputAmount(value, poolInfo, false),
          );
          break;
        case InputControlsNames.BASE_VALUE:
          setValue(
            InputControlsNames.QUOTE_VALUE,
            getOutputAmount(value, poolInfo, true),
          );
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calculateTotalDeposit(baseValue, quoteValue, currentSolanaPriceUSD),
    );
  }, [baseValue, quoteValue, currentSolanaPriceUSD, setValue]);

  useEffect(() => {
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      fetchPoolInfo(payToken.address, receiveToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const isDepositBtnEnabled =
    poolInfo && connected && isVerified && Number(baseValue) > 0;

  const isSwapBtnEnabled = poolInfo && connected && Number(baseValue) > 0;

  return {
    formControl: control,
    totalValue,
    isDepositBtnEnabled,
    handleChange,
    quoteValue,
    baseValue,
    currentSolanaPriceUSD,
    isSwapBtnEnabled,
    onPayTokenChange,
    receiveToken,
    payValue,
    payToken,
    receiveValue,
    changeSides,
    onReceiveTokenChange,
  };
};
