import { useRef, useEffect, useState, useMemo } from 'react';
import { Percent } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../utils';
import { getOutputAmount } from '../../SwapForm/helpers';
import { useLazyPoolInfo } from './useLazyPoolInfo';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
} from '../../../contexts/fraktion';
import BN from 'bn.js';
import { useConfirmModal } from '../../ConfirmModal';

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
  defaultTokenMint: string,
): {
  formControl: Control<FormFieldValues>;
  onPayTokenChange: (nextToken: TokenInfo) => void;
  onReceiveTokenChange: (nextToken: TokenInfo) => void;
  changeSides: () => void;
  isSwapBtnEnabled: boolean;
  receiveToken: TokenInfo;
  payToken: TokenInfo;
  slippage: string;
  tokenMinAmount: string;
  tokenPriceImpact: string;
  valuationDifference: string;
  setSlippage: (nextValue: string) => void;
  handleSwap: () => void;
  confirmModalVisible: boolean;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { connected } = useWallet();
  const intervalRef = useRef<any>();
  const { vaults } = useFraktion();
  useFraktionInitialFetch();
  useFraktionPolling();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.RECEIVE_TOKEN]:
        poolDataByMint.get(defaultTokenMint)?.tokenInfo || null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_VALUE]: '',
    },
  });

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const { receiveToken, payValue, payToken, receiveValue } = watch();

  const [slippage, setSlippage] = useState<string>('1');
  const [tokenMinAmount, setTokenMinAmountOut] = useState<string>('');
  const [tokenPriceImpact, setTokenPriceImpact] = useState<string>('');

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

  const vaultInfo = useMemo(() => {
    if (receiveToken && payToken) {
      const token =
        payToken.address === SOL_TOKEN.address ? receiveToken : payToken;

      return vaults.find(({ fractionMint }) => fractionMint === token.address);
    } else {
      return null;
    }
  }, [vaults, receiveToken, payToken]);

  const changeSides = () => {
    const payValueBuf = payValue;
    const payTokenBuf = payToken;

    setValue(InputControlsNames.PAY_VALUE, receiveValue);
    setValue(InputControlsNames.PAY_TOKEN, receiveToken);
    setValue(InputControlsNames.RECEIVE_VALUE, payValueBuf);
    setValue(InputControlsNames.RECEIVE_TOKEN, payTokenBuf);
  };

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
      const { poolConfig } = poolDataByMint.get(
        payToken.address === SOL_TOKEN.address
          ? receiveToken.address
          : payToken.address,
      );

      const persentSlippage = new Percent(
        Math.round(Number(slippage) * 100),
        10_000,
      );

      const { amountOut, minAmountOut, priceImpact } = getOutputAmount({
        poolKeys: poolConfig,
        poolInfo,
        payToken,
        payAmount: Number(payValue),
        receiveToken,
        slippage: persentSlippage,
      });

      setTokenMinAmountOut(minAmountOut);
      setTokenPriceImpact(priceImpact);
      setValue(InputControlsNames.RECEIVE_VALUE, amountOut);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payValue, payToken, receiveValue, receiveToken, poolInfo, setValue]);

  useEffect(() => {
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      fetchPoolInfo(payToken.address, receiveToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const isSwapBtnEnabled = poolInfo && connected && Number(payValue) > 0;

  const valuationDifference: string = useMemo(() => {
    if (!vaultInfo) {
      return '';
    }

    const isBuy = payToken.address === SOL_TOKEN.address;

    if (isBuy) {
      const amountMarket = Number(receiveValue);

      const amountLocked =
        (vaultInfo.lockedPricePerShare.toNumber() * Number(payValue)) / 10 ** 2;

      const difference = (amountMarket / amountLocked) * 100 - 100;

      return isNaN(difference) ? '0' : difference.toFixed(2);
    } else {
      const amountMarketSOL = Number(receiveValue);

      const amountLockedSOL =
        (vaultInfo.lockedPricePerShare.toNumber() * Number(payValue)) / 10 ** 6;

      const difference = (amountMarketSOL / amountLockedSOL) * 100 - 100;

      return isNaN(difference) ? '0' : difference.toFixed(2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo, payValue, receiveValue, payToken, receiveToken]);

  const handleSwap = async () => {
    closeConfirmModal();

    const isBuy = payToken.address === SOL_TOKEN.address;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolDataByMint.get(splToken.address).poolConfig;

    const payAmount = new BN(Number(payValue) * 10 ** payToken.decimals);

    const quoteAmount = new BN(
      Number(tokenMinAmount) * 10 ** receiveToken.decimals,
    );

    await raydiumSwap({
      baseToken: payToken,
      baseAmount: payAmount,
      quoteToken: receiveToken,
      quoteAmount: quoteAmount,
      poolConfig,
    });

    fetchPoolInfo(payToken.address, receiveToken.address);
  };

  return {
    formControl: control,
    isSwapBtnEnabled,
    receiveToken,
    onPayTokenChange,
    onReceiveTokenChange,
    payToken,
    changeSides,
    slippage,
    setSlippage,
    tokenMinAmount,
    tokenPriceImpact,
    valuationDifference,
    handleSwap,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  };
};
