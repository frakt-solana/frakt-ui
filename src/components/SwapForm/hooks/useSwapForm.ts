import { useRef, useEffect, useMemo } from 'react';

import {
  useLiquidityPools,
  useCurrentSolanaPrice,
} from '../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../utils';

import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { getOutputAmount } from '../../SwapForm/helpers';
import { useLazyPoolInfo } from './useLazyPoolInfo';
import { useFraktion, VaultData } from '../../../contexts/fraktion';

export enum InputControlsNames {
  RECEIVE_TOKEN = 'receiveToken',
  RECEIVE_VALUE = 'receiveValue',
  PAY_TOKEN = 'payToken',
  PAY_VALUE = 'payValue',
}

export type FormFieldValues = {
  [InputControlsNames.RECEIVE_TOKEN]: TokenInfo;
  [InputControlsNames.RECEIVE_VALUE]: string;
  [InputControlsNames.PAY_TOKEN]: TokenInfo;
  [InputControlsNames.PAY_VALUE]: string;
};

export const useSwapForm = (
  defaultTokenMint?: string,
): {
  formControl: Control<FormFieldValues>;
  onPayTokenChange: (nextToken: TokenInfo) => void;
  onReceiveTokenChange;
  changeSides: () => void;
  currentSolanaPriceUSD: number;
  isSwapBtnEnabled: boolean;
  receiveToken: TokenInfo;
  payToken: TokenInfo;
  payValue: string;
  receiveValue: string;
  vaultInfo: VaultData;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { poolDataByMint } = useLiquidityPools();
  const { connected } = useWallet();
  const intervalRef = useRef<any>();
  const { vaults } = useFraktion();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.RECEIVE_TOKEN]:
        poolDataByMint.get(defaultTokenMint)?.tokenInfo || null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_VALUE]: '',
    },
  });

  const { receiveToken, payValue, payToken, receiveValue } = watch();

  useEffect(() => {
    register(InputControlsNames.PAY_VALUE);
    register(InputControlsNames.RECEIVE_VALUE);
  }, [register]);

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

  const vaultInfo = useMemo(() => {
    if (receiveToken && payToken) {
      const token =
        payToken.address === SOL_TOKEN.address ? receiveToken : payToken;

      return vaults.find(({ fractionMint }) => fractionMint === token.address);
    } else {
      return null;
    }
  }, [vaults, receiveToken, payToken]);

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

  useEffect(() => {
    if (poolInfo && payToken !== receiveToken) {
      setValue(
        InputControlsNames.RECEIVE_VALUE,
        getOutputAmount(
          payValue,
          poolInfo,
          payToken.address === SOL_TOKEN.address,
        ),
      );
    }
  }, [payValue, payToken, receiveValue, receiveToken, poolInfo, setValue]);

  useEffect(() => {
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      fetchPoolInfo(payToken.address, receiveToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const isSwapBtnEnabled = poolInfo && connected && Number(payValue) > 0;

  return {
    formControl: control,
    currentSolanaPriceUSD,
    isSwapBtnEnabled,
    onPayTokenChange,
    receiveToken,
    payValue,
    payToken,
    receiveValue,
    changeSides,
    onReceiveTokenChange,
    vaultInfo,
  };
};
