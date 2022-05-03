import { useEffect, useState, useMemo } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { useTokenListContext } from '../../../contexts/TokenList';
import { SOL_TOKEN } from '../../../utils';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
} from '../../../contexts/fraktion';
import { useConfirmModal } from '../../ConfirmModal';
import { useLoadingModal } from '../../LoadingModal';

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
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  setSlippage: (nextValue: string) => void;
  handleSwap: () => void;
  confirmModalVisible: boolean;
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
} => {
  const { tokensList } = useTokenListContext();
  const { poolDataByMint, prismaSwap, prisma } = useLiquidityPools();
  const { connected } = useWallet();
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

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onPayTokenChange = (nextToken: TokenInfo) => {
    setValue(InputControlsNames.PAY_VALUE, '');
    setValue(InputControlsNames.PAY_TOKEN, nextToken);
  };

  const onReceiveTokenChange = (nextToken: TokenInfo) => {
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
      console.log(routes);
      setTokenPriceImpact(routes.priceImpact.toFixed(2));
      setTokenMinAmountOut(routes.minimumReceived.toFixed(2));
      setValue(InputControlsNames.RECEIVE_VALUE, amount);
    } else {
      setValue(InputControlsNames.RECEIVE_VALUE, '');
    }
  }, [payValue, payToken, receiveToken]);

  useEffect(() => {
    (async () => {
      if (prisma?.user && payToken?.address && receiveToken?.address) {
        await prisma.loadRoutes(payToken?.address, receiveToken?.address);
        const routes = prisma.getRoutes(1)[0];
        console.log(routes);
        setRoutes(routes);
      }
    })();
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
