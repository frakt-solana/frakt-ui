import { useEffect, useRef, useState } from 'react';
import BN from 'bn.js';
import { Control, useForm } from 'react-hook-form';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { LiquidityPoolKeysV4, LiquiditySide } from '@raydium-io/raydium-sdk';

import {
  calculateTotalDeposit,
  useCurrentSolanaPrice,
  useLiquidityPools,
} from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { getOutputAmount } from '../SwapForm/helpers';
import { useLazyPoolInfo } from '../SwapForm/hooks/useLazyPoolInfo';
import { FusionPoolInfo } from './../../contexts/liquidityPools/liquidityPools.model';
import { useLoadingModal } from '../LoadingModal';
import { AccountInfoParsed } from '../../utils/accounts';

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
  fusionPoolInfo: FusionPoolInfo,
  lpTokenAccountInfo: AccountInfoParsed,
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
  loadingModalVisible: boolean;
  openLoadingModal: () => void;
  closeLoadingModal: () => void;
  onSubmit: () => Promise<void>;
  loadingModalSubtitle: string;
} => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const wallet = useWallet();

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

  const { addRaydiumLiquidity: addRaydiumLiquidityTxn } = useLiquidityPools();
  const { stakeLiquidity: stakeLiquidityTxn } = useLiquidityPools();

  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const lpTokenAmountOnSubmit = useRef<BN>();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModalRaw,
  } = useLoadingModal();

  const closeLoadingModal = () => {
    lpTokenAmountOnSubmit.current && (lpTokenAmountOnSubmit.current = null);
    closeLoadingModalRaw();
  };

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calculateTotalDeposit(
        quoteValue,
        baseValue,
        currentSolanaPriceUSD,
      )?.toString(),
    );
  }, [baseValue, quoteValue, currentSolanaPriceUSD, setValue]);

  const isDepositBtnEnabled =
    poolInfo && wallet.connected && isVerified && Number(baseValue) > 0;

  const addRaydiumLiquidity = async () => {
    const baseAmount = new BN(Number(baseValue) * 10 ** quoteToken.decimals);
    const quoteAmount = new BN(Number(quoteValue) * 1e9);

    const result = await addRaydiumLiquidityTxn({
      baseToken: quoteToken,
      baseAmount,
      quoteToken: SOL_TOKEN,
      quoteAmount,
      poolConfig,
      fixedSide: liquiditySide,
    });

    setTransactionsLeft(1);

    return !!result;
  };

  const stakeLiquidity = async () => {
    setTransactionsLeft(1);
    await stakeLiquidityTxn({
      amount: new BN(Number(lpTokenAmountOnSubmit.current)),
      router: fusionPoolInfo.mainRouter,
    });

    closeLoadingModal();
    setTransactionsLeft(null);
    lpTokenAmountOnSubmit.current = null;
  };

  const onSubmit = async () => {
    const isPoolAwarded = fusionPoolInfo?.mainRouter;

    if (isPoolAwarded) {
      lpTokenAmountOnSubmit.current = lpTokenAccountInfo?.accountInfo?.amount;
      setTransactionsLeft(2);
    } else {
      setTransactionsLeft(1);
    }

    openLoadingModal();

    const result = await addRaydiumLiquidity();

    if (!isPoolAwarded || !result) {
      setTransactionsLeft(null);
      lpTokenAmountOnSubmit.current = null;
      closeLoadingModal();
    }
  };

  useEffect(() => {
    if (lpTokenAmountOnSubmit.current) {
      stakeLiquidity();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpTokenAccountInfo]);

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
    loadingModalVisible,
    openLoadingModal,
    closeLoadingModal,
    onSubmit,
    loadingModalSubtitle: `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`,
  };
};
