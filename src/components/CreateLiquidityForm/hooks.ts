import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import { Control, useForm } from 'react-hook-form';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { useTokensMap } from '../../contexts/TokenList';
import { decimalBNToString, SOL_TOKEN } from '../../utils';
import {
  useCurrentSolanaPrice,
  calcTotalForCreateLiquidity,
  useLiquidityPools,
} from '../../contexts/liquidityPools';

export enum InputControlsNames {
  QUOTE_VALUE = 'quoteValue',
  BASE_VALUE = 'baseValue',
  TOTAL_VALUE = 'totalValue',
  IS_VERIFIED = 'isVerified',
}

export type FormFieldValues = {
  [InputControlsNames.QUOTE_VALUE]: string;
  [InputControlsNames.BASE_VALUE]: string;
  [InputControlsNames.TOTAL_VALUE]: string;
  [InputControlsNames.IS_VERIFIED]: boolean;
};

export const useCreateLiquidityForm = (
  vaultLockedPrice: BN,
  defaultTokenMint: string,
  marketId: PublicKey,
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isCreateBtnEnabled: boolean;
  tokenInfo: TokenInfo;
  baseValue: string;
  quoteValue: string;
  handleSwap: (value: string, name: InputControlsNames) => void;
  handleCreateLiquidity: () => void;
} => {
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { createRaydiumLiquidityPool } = useLiquidityPools();
  const { connected } = useWallet();
  const tokensMap = useTokensMap();

  const tokenInfo = tokensMap.get(defaultTokenMint) || null;

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.QUOTE_VALUE]: '',
      [InputControlsNames.BASE_VALUE]: '',
      [InputControlsNames.TOTAL_VALUE]: '',
      [InputControlsNames.IS_VERIFIED]: false,
    },
  });

  const { isVerified, quoteValue, baseValue, totalValue } = watch();

  useEffect(() => {
    register(InputControlsNames.QUOTE_VALUE);
    register(InputControlsNames.BASE_VALUE);
    register(InputControlsNames.TOTAL_VALUE);
  }, [register]);

  const tokenPrice = decimalBNToString(vaultLockedPrice.mul(new BN(1e3)), 6, 9);

  const handleSwap = (value: string, name: InputControlsNames) => {
    setValue(name, value);
    if (name === InputControlsNames.BASE_VALUE) {
      setValue(
        InputControlsNames.QUOTE_VALUE,
        String(Number(value) * Number(tokenPrice)),
      );
    } else {
      setValue(
        InputControlsNames.BASE_VALUE,
        String(Number(value) / Number(tokenPrice)),
      );
    }
  };

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calcTotalForCreateLiquidity(
        baseValue,
        quoteValue,
        tokenPrice,
        currentSolanaPriceUSD,
      ),
    );
  }, [baseValue, quoteValue, tokenPrice, currentSolanaPriceUSD, setValue]);

  const isCreateBtnEnabled = connected && isVerified && Number(baseValue) > 0;

  const handleCreateLiquidity = () => {
    const baseAmount = new BN(parseFloat(baseValue) * 10 ** tokenInfo.decimals);
    const quoteAmount = new BN(
      parseFloat(quoteValue) * 10 ** SOL_TOKEN.decimals,
    );

    createRaydiumLiquidityPool({
      baseAmount,
      quoteAmount,
      baseToken: tokenInfo,
      quoteToken: SOL_TOKEN,
      marketId,
    });
  };

  return {
    formControl: control,
    totalValue,
    isCreateBtnEnabled,
    tokenInfo,
    baseValue,
    quoteValue,
    handleSwap,
    handleCreateLiquidity,
  };
};
