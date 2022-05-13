import { useEffect, useState, useMemo, useRef } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../utils';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
} from '../../../contexts/fraktion';
import { useConfirmModal } from '../../ConfirmModal';
import { useLoadingModal } from '../../LoadingModal';
import { useLazyPoolInfo } from './useLazyPoolInfo';

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

export const useSwapForm = (): {
  formControl: Control<FormFieldValues>;
  onPayTokenChange: (nextToken: TokenInfo) => void;
  onReceiveTokenChange: (nextToken: TokenInfo) => void;
  changeSides: () => void;
  isSwapBtnEnabled: boolean;
  receiveToken: TokenInfo;
  payToken: TokenInfo;
  slippage: number;
  tokenMinAmount: string;
  tokenPriceImpact: string;
  valuationDifference: string;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  setSlippage: (nextValue: number) => void;
  handleSwap: () => void;
  confirmModalVisible: boolean;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
} => {
  const { prismaSwap, prisma } = useLiquidityPools();
  const { fetchPoolInfo } = useLazyPoolInfo();
  const { connected } = useWallet();
  const { vaults } = useFraktion();
  useFraktionInitialFetch();
  useFraktionPolling();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_TOKEN]: null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.RECEIVE_VALUE]: '',
    },
  });

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const { receiveToken, payValue, payToken, receiveValue } = watch();

  const [slippage, setSlippage] = useState<number>(1);
  const [tokenMinAmount, setTokenMinAmountOut] = useState<string>('');
  const [tokenPriceImpact, setTokenPriceImpact] = useState<string>('');

  const intervalRef = useRef<any>();

  useEffect(() => {
    register(InputControlsNames.PAY_VALUE);
    register(InputControlsNames.RECEIVE_VALUE);
  }, [register]);

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onPayTokenChange = (nextToken: TokenInfo): void => {
    setValue(InputControlsNames.PAY_VALUE, '');
    setValue(InputControlsNames.PAY_TOKEN, nextToken);
  };

  const onReceiveTokenChange = (nextToken: TokenInfo): void => {
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

  const [routes, setRoutes] = useState<any>();

  useEffect(() => {
    if (prisma?.user && routes) {
      const amount = String(routes?.amountOut * Number(payValue));
      setValue(InputControlsNames.RECEIVE_VALUE, amount);
    } else {
      setValue(InputControlsNames.RECEIVE_VALUE, '');
    }
  }, [payValue, payToken, receiveToken, receiveValue, setValue]);

  useEffect(() => {
    (async () => {
      if (prisma?.user && payToken?.address && receiveToken?.address) {
        await prisma.loadRoutes(payToken?.address, receiveToken?.address);
        const routes = prisma.getRoutes(1)[0];
        setRoutes(routes);
      }
    })();
  }, [payToken, receiveToken]);

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
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      fetchPoolInfo(payToken.address, receiveToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const isSwapBtnEnabled = connected && Number(payValue) > 0;

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
    openLoadingModal();

    await prismaSwap({
      receiveToken: receiveToken.address,
      payToken: payToken.address,
      tokensList: prisma?.tokenList?.tokens,
      payValue,
      slippage,
    });

    closeLoadingModal();
  };

  return {
    loadingModalVisible,
    closeLoadingModal,
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
