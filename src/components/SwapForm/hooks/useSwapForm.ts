import { useEffect, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useConfirmModal } from '../../ConfirmModal';
import { useLoadingModal } from '../../LoadingModal';
import { useTokenListContext } from '../../../contexts/TokenList';
import { SOL_TOKEN } from '../../../utils';
import { useDebounce } from '../../../hooks';
import { usePrism } from '../../../contexts/prism/prism.hooks';

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
  slippage: number;
  tokenMinAmount: number;
  tokenPriceImpact: number;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  setSlippage: (nextValue: number) => void;
  handleSwap: () => void;
  confirmModalVisible: boolean;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
} => {
  const { prismSwap, prism } = usePrism();
  const { tokensList, fraktionTokensMap } = useTokenListContext();
  const { connected } = useWallet();

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_TOKEN]:
        fraktionTokensMap.get(defaultTokenMint) || null,
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
  const [tokenPriceImpact, setTokenPriceImpact] = useState<number>(0);

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
    if (!payValue) {
      setTokenPriceImpact(0);
    }
    searchItems(payValue);
  }, [payValue, searchItems]);

  const loadRoutes = async (value: number) => {
    await prism.loadRoutes(payToken?.address, receiveToken?.address);
    return prism.getRoutes(value)[0];
  };

  useEffect(() => {
    if (prism && route) {
      const amountOut = route?.amountOut * Number(debouncePayValue);
      const minimumReceived = amountOut - (amountOut / 100) * slippage;

      setValue(InputControlsNames.RECEIVE_VALUE, String(amountOut));
      setValue(InputControlsNames.TOKEN_MIN_AMOUNT, minimumReceived);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, payToken, receiveToken, debouncePayValue]);

  useEffect(() => {
    (async () => {
      if (prism && payToken?.address && receiveToken?.address) {
        const bestRoute = await loadRoutes(1);
        setRoute(bestRoute);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  useEffect(() => {
    (async () => {
      if (
        prism &&
        payToken?.address &&
        receiveToken?.address &&
        debouncePayValue
      ) {
        const bestRoute = await loadRoutes(debouncePayValue);
        setTokenPriceImpact(Math.min(100, bestRoute?.priceImpact));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken, debouncePayValue]);

  const isSwapBtnEnabled = connected && Number(payValue) > 0;

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
    handleSwap,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  };
};
