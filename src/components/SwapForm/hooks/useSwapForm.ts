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
import { useTokenListContext } from '../../../contexts/TokenList';
import { useDebounce } from '../../../hooks';

export enum InputControlsNames {
  RECEIVE_TOKEN = 'receiveToken',
  RECEIVE_VALUE = 'receiveValue',
  PAY_TOKEN = 'payToken',
  PAY_VALUE = 'payValue',
  TOKEN_MIN_AMOUNT = 'tokenMinAmount',
}

export type FormFieldValues = {
  [InputControlsNames.RECEIVE_TOKEN]: TokenInfo;
  [InputControlsNames.RECEIVE_VALUE]: string;
  [InputControlsNames.PAY_TOKEN]: TokenInfo;
  [InputControlsNames.PAY_VALUE]: string;
  [InputControlsNames.TOKEN_MIN_AMOUNT]: number;
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
  tokenMinAmount: number;
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
  const { prismSwap, prism } = useLiquidityPools();
  const { fetchPoolInfo } = useLazyPoolInfo();
  const { poolDataByMint } = useLiquidityPools();

  const { tokensList } = useTokenListContext();

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
      [InputControlsNames.TOKEN_MIN_AMOUNT]: null,
    },
  });

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const { receiveToken, payValue, payToken, receiveValue, tokenMinAmount } =
    watch();

  const [slippage, setSlippage] = useState<number>(1);
  const [tokenPriceImpact, setTokenPriceImpact] = useState<string>('');

  const intervalRef = useRef<any>();

  const isPoolToken = poolDataByMint.has(
    receiveToken?.address || payToken?.address,
  );

  useEffect(() => {
    register(InputControlsNames.PAY_VALUE);
    register(InputControlsNames.RECEIVE_VALUE);
    register(InputControlsNames.TOKEN_MIN_AMOUNT);
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

  const [route, setRoute] = useState<any>();
  const [debouncePayValue, setDebouncePayValue] = useState<number>(0);

  const searchItems = useDebounce((payValue: number) => {
    setDebouncePayValue(payValue);
  }, 600);

  useEffect(() => {
    searchItems(payValue);
  }, [payValue, searchItems]);

  useEffect(() => {
    if (prism && route) {
      const { amountOut, minimumReceived, priceImpact } = route;

      setTokenPriceImpact(Math.min(100, priceImpact).toFixed(2));
      setValue(InputControlsNames.RECEIVE_VALUE, String(amountOut));
      setValue(InputControlsNames.TOKEN_MIN_AMOUNT, minimumReceived);
    }
  }, [
    debouncePayValue,
    searchItems,
    route,
    payToken,
    receiveToken,
    setValue,
    slippage,
    prism,
  ]);

  useEffect(() => {
    (async () => {
      if (prism && payToken?.address && receiveToken?.address) {
        if (!debouncePayValue) {
          setValue(InputControlsNames.RECEIVE_VALUE, '');
          setValue(InputControlsNames.TOKEN_MIN_AMOUNT, '');
          setTokenPriceImpact('');
          setRoute(null);
        } else {
          await prism.loadRoutes(payToken?.address, receiveToken?.address);
          const bestRoute = prism.getRoutes(debouncePayValue)[0];
          setRoute(bestRoute);
        }
      }
    })();
  }, [payToken, receiveToken, prism, debouncePayValue, setValue]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (
      isPoolToken &&
      payToken &&
      receiveToken &&
      payToken.address !== receiveToken.address
    ) {
      intervalRef.current = setInterval(() => {
        fetchPoolInfo(payToken.address, receiveToken.address);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  useEffect(() => {
    if (
      isPoolToken &&
      payToken &&
      receiveToken &&
      payToken.address !== receiveToken.address
    ) {
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

    await prismSwap({
      receiveToken: receiveToken.address,
      payToken: payToken.address,
      tokensList,
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
