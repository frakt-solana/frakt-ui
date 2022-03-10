import { useEffect, useRef } from 'react';
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

  const { addRaydiumLiquidity } = useLiquidityPools();
  const { stakeLiquidity } = useLiquidityPools();
  const lpTokenAmountOnSubmit = useRef<string>(null);

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

  const onSubmit = async () => {
    const baseAmount = new BN(Number(baseValue) * 10 ** quoteToken.decimals);
    const quoteAmount = new BN(Number(quoteValue) * 1e9);

    openLoadingModal();

    lpTokenAmountOnSubmit.current =
      lpTokenAccountInfo?.accountInfo?.amount?.toString() || '0';

    await addRaydiumLiquidity({
      baseToken: quoteToken,
      baseAmount,
      quoteToken: SOL_TOKEN,
      quoteAmount,
      poolConfig,
      fixedSide: liquiditySide,
    });
  };

  useEffect(() => {
    (async () => {
      const tokenAmount = lpTokenAccountInfo?.accountInfo?.amount?.toString();

      if (
        !!lpTokenAmountOnSubmit.current &&
        tokenAmount !== lpTokenAmountOnSubmit.current
      ) {
        await stakeLiquidity({
          amount: new BN(Number(tokenAmount)),
          router: fusionPoolInfo.mainRouter,
        });
        lpTokenAmountOnSubmit.current = null;
        closeLoadingModal();
      }
    })();
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
  };
};
