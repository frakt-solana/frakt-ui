import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import { Control, useForm } from 'react-hook-form';
import BN from 'bn.js';

import { useTokensMap } from '../../contexts/TokenList';
import { decimalBNToString } from '../../utils';
import {
  useCurrentSolanaPrice,
  calcTotalForCreateLiquidity,
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
): {
  formControl: Control<FormFieldValues>;
  totalValue: string;
  isCreateBtnEnabled: boolean;
  quoteToken: TokenInfo;
} => {
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { connected } = useWallet();
  const tokensMap = useTokensMap();

  const quoteToken = tokensMap.get(defaultTokenMint) || null;

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

  const quoteTokenPrice = decimalBNToString(
    vaultLockedPrice.mul(new BN(1e3)),
    6,
    9,
  );

  useEffect(() => {
    setValue(
      InputControlsNames.TOTAL_VALUE,
      calcTotalForCreateLiquidity(
        baseValue,
        quoteValue,
        quoteTokenPrice,
        currentSolanaPriceUSD,
      ),
    );
  }, [baseValue, quoteValue, quoteTokenPrice, currentSolanaPriceUSD, setValue]);

  const isCreateBtnEnabled = connected && isVerified && Number(baseValue) > 0;

  return {
    formControl: control,
    totalValue,
    isCreateBtnEnabled,
    quoteToken,
  };
};
