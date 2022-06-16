import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useConfirmModal } from '../../ConfirmModal';
import { useLoadingModal } from '../../LoadingModal';
import { selectTokenListState } from '../../../state/tokenList/selectors';
import { notify, SOL_TOKEN } from '../../../utils';
import { useDebounce } from '../../../hooks';
import { usePrism } from '../../../contexts/prism/prism.hooks';
import { NotifyType } from '../../../utils/solanaUtils';
import { selectUserTokensState } from '../../../state/userTokens/selectors';
import { getTokenBalance } from '../../TokenField/TokenFieldWithBalance';
import { useNativeAccount } from '../../../utils/accounts';
import { captureSentryError } from '../../../utils/sentry';

export enum InputControlsNames {
  RECEIVE_TOKEN = 'receiveToken',
  RECEIVE_VALUE = 'receiveValue',
  PAY_TOKEN = 'payToken',
  PAY_VALUE = 'payValue',
  TOKEN_MIN_AMOUNT = 'tokenMinAmount',
  TOKEN_PRICE_IMPACT = 'tokenPriceImpact',
}

export type FormFieldValues = {
  [InputControlsNames.RECEIVE_TOKEN]: TokenInfo;
  [InputControlsNames.RECEIVE_VALUE]: string;
  [InputControlsNames.PAY_TOKEN]: TokenInfo;
  [InputControlsNames.PAY_VALUE]: string;
  [InputControlsNames.TOKEN_MIN_AMOUNT]: number;
  [InputControlsNames.TOKEN_PRICE_IMPACT]: number;
};

export const useSwapForm = (
  defaultTokenMint?: string,
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
  swapTokenList: TokenInfo[];
} => {
  const { prism } = usePrism();
  const { fraktionTokensMap, tokensList, fraktionTokensList } =
    useSelector(selectTokenListState);
  const wallet = useWallet();
  const { rawUserTokensByMint } = useSelector(selectUserTokensState);
  const { account } = useNativeAccount();

  const [slippage, setSlippage] = useState<number>(1);
  const [debouncePayValue, setDebouncePayValue] = useState<number>(0);
  const [routersIsLoaded, setRoutersIsLoaded] = useState<string[]>([]);

  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.PAY_TOKEN]: SOL_TOKEN,
      [InputControlsNames.RECEIVE_TOKEN]:
        fraktionTokensMap.get(defaultTokenMint) || null,
      [InputControlsNames.PAY_VALUE]: '',
      [InputControlsNames.RECEIVE_VALUE]: '',
      [InputControlsNames.TOKEN_PRICE_IMPACT]: 0,
      [InputControlsNames.TOKEN_MIN_AMOUNT]: 0,
    },
  });

  const fraktTokenWithBalance = fraktionTokensList.map((token: TokenInfo) => {
    const balance = getTokenBalance(token, account, rawUserTokensByMint);
    return {
      ...token,
      balance: balance || 0,
    };
  });

  const sortFraktTokenByBalance = useMemo(() => {
    return Object.values(fraktTokenWithBalance)
      .sort(({ symbol: symbolA }, { symbol: symbolB }) => {
        return symbolA?.localeCompare(symbolB);
      })
      .sort(({ balance: balanceA }, { balance: balanceB }) => {
        return balanceA && balanceB
          ? Math.abs(Number(balanceA)) > Math.abs(Number(balanceB))
            ? -1
            : 1
          : -1;
      });
  }, [fraktTokenWithBalance]);

  const filteredTokenList = useMemo(() => {
    return tokensList
      .filter(({ tags }) => !tags?.includes('frakt-nft-pool'))
      .sort(({ symbol: symbolA }, { symbol: symbolB }) => {
        return symbolA?.localeCompare(symbolB);
      });
  }, [tokensList]);

  const swapTokenList = [...sortFraktTokenByBalance, ...filteredTokenList];

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const {
    tokenPriceImpact,
    receiveToken,
    payValue,
    payToken,
    receiveValue,
    tokenMinAmount,
  } = watch();

  useEffect(() => {
    register(InputControlsNames.PAY_VALUE);
    register(InputControlsNames.RECEIVE_VALUE);
    register(InputControlsNames.TOKEN_MIN_AMOUNT);
    register(InputControlsNames.TOKEN_PRICE_IMPACT);
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

  const changeSides = (): void => {
    const payValueBuf = payValue;
    const payTokenBuf = payToken;

    setValue(InputControlsNames.PAY_VALUE, receiveValue);
    setValue(InputControlsNames.PAY_TOKEN, receiveToken);
    setValue(InputControlsNames.RECEIVE_VALUE, payValueBuf);
    setValue(InputControlsNames.RECEIVE_TOKEN, payTokenBuf);
  };

  const searchItems = useDebounce((payValue: number): void => {
    setDebouncePayValue(payValue);
  }, 400);

  useEffect(() => {
    if (!payValue) {
      setValue(InputControlsNames.RECEIVE_VALUE, '');
      setValue(InputControlsNames.TOKEN_PRICE_IMPACT, 0);
      setValue(InputControlsNames.TOKEN_MIN_AMOUNT, 0);
    }
    searchItems(payValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payValue, searchItems]);

  useEffect(() => {
    (async () => {
      if (prism && payToken && receiveToken) {
        await prism.loadRoutes(payToken.address, receiveToken.address);
        setRoutersIsLoaded([payToken.address, receiveToken.address]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken, prism]);

  useEffect(() => {
    if (prism && payToken && receiveToken && debouncePayValue) {
      const route = prism.getRoutes(Number(payValue))[0];

      if (route) {
        const { priceImpact, amountOut, minimumReceived } = route;
        const maxPriceImpact = Math.min(100, priceImpact);

        setValue(InputControlsNames.TOKEN_PRICE_IMPACT, maxPriceImpact);
        setValue(InputControlsNames.RECEIVE_VALUE, String(amountOut));
        setValue(InputControlsNames.TOKEN_MIN_AMOUNT, minimumReceived);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncePayValue, routersIsLoaded]);

  const isSwapBtnEnabled =
    (prism as any)?.user &&
    routersIsLoaded.length &&
    wallet.connected &&
    Number(payValue) > 0;

  const handleSwap = async (): Promise<void> => {
    try {
      closeConfirmModal();
      openLoadingModal();

      const routes = prism.getRoutes(Number(payValue));

      prism.setSlippage(slippage);

      await prism.swap(routes[0]);

      notify({ message: 'Swapped successfully', type: NotifyType.SUCCESS });
    } catch (error) {
      notify({ message: 'Swap failed', type: NotifyType.ERROR });

      captureSentryError({
        error,
        user: wallet?.publicKey?.toBase58(),
        transactionName: 'swapTokens',
      });
    } finally {
      closeLoadingModal();
    }
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
    swapTokenList,
  };
};
