import { NftPoolData } from '../../utils/cacher/nftPools/nftPools.model';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { UserNFTWithCollection } from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useUserSplAccount } from '../../utils/accounts';
import { SORT_VALUES } from './components/NFTPoolNFTsList';
import { LOTTERY_TICKET_ACCOUNT_LAYOUT } from './constants';
import { FilterFormFieldsValues, FilterFormInputsNames } from './model';
import { useLiquidityPools } from '../../contexts/liquidityPools';
import { getOutputAmount } from '../../components/SwapForm';
import { Percent } from '@raydium-io/raydium-sdk';
import { SOL_TOKEN } from '../../utils';
import { TokenInfo } from '@solana/spl-token-registry';

type UseNFTsFiltering = (nfts: UserNFTWithCollection[]) => {
  control: Control<FilterFormFieldsValues>;
  nfts: UserNFTWithCollection[];
  setSearch: (value?: string) => void;
};

export const useNFTsFiltering: UseNFTsFiltering = (nfts) => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);

  const filteredNfts = useMemo(() => {
    if (nfts.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return nfts
        .filter((nft) => {
          const nftName = nft?.metadata?.name?.toUpperCase() || '';

          return nftName.includes(searchString);
        })
        .sort((nftA, nftB) => {
          if (sortField === 'name') {
            if (sortOrder === 'asc')
              return nftA?.metadata?.name?.localeCompare(nftB?.metadata?.name);
            return nftB?.metadata?.name?.localeCompare(nftA?.metadata?.name);
          }
          return 0;
        });
    }

    return [];
  }, [nfts, sort, searchString]);

  return { control, nfts: filteredNfts, setSearch: searchDebounced };
};

type SubscribeOnLotteryTicketChanges = (
  lotteryTicketPublicKey: PublicKey,
  callback: (value: string) => void,
) => void;

type UseLotteryTicketSubscription = () => {
  subscribe: SubscribeOnLotteryTicketChanges;
  unsubscribe: () => void;
};

export const useLotteryTicketSubscription: UseLotteryTicketSubscription =
  () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const subscriptionId = useRef<number>();

    const subscribe: SubscribeOnLotteryTicketChanges = (
      lotteryTicketPublicKey,
      callback,
    ) => {
      subscriptionId.current = connection.onAccountChange(
        lotteryTicketPublicKey,
        (lotteryTicketAccountEncoded) => {
          const account = LOTTERY_TICKET_ACCOUNT_LAYOUT.decode(
            lotteryTicketAccountEncoded.data,
          );

          callback(account.winning_safety_box.toBase58());
        },
      );
    };

    const unsubscribe = () => {
      if (subscriptionId.current) {
        connection.removeAccountChangeListener(subscriptionId.current);
        subscriptionId.current = null;
      }
    };

    useEffect(() => {
      return () => unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, wallet]);

    return {
      subscribe,
      unsubscribe,
    };
  };

const POOL_TOKEN_DECIMALS = 6;

export const useNftPoolTokenBalance = (
  pool: NftPoolData,
): {
  balance: number;
} => {
  const { connected } = useWallet();

  const { accountInfo, subscribe: splTokenSubscribe } = useUserSplAccount();

  useEffect(() => {
    connected && splTokenSubscribe(pool?.fractionMint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const balance = accountInfo
    ? accountInfo?.accountInfo?.amount?.toNumber() / 10 ** POOL_TOKEN_DECIMALS
    : 0;

  return {
    balance,
  };
};

type UsePoolTokensPrices = (poolTokensInfo: [TokenInfo]) => {
  loading: boolean;
  prices: string[];
};

export const usePoolTokensPrices: UsePoolTokensPrices = (poolTokensInfo) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [prices, setPrices] = useState<string[]>([]);

  const {
    poolDataByMint,
    loading: liquidityPoolsLoading,
    fetchRaydiumPoolsInfo,
  } = useLiquidityPools();

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const poolsData = poolTokensInfo
        .map((poolTokenInfo) => poolDataByMint.get(poolTokenInfo?.address))
        .filter((poolData) => !!poolData);

      if (poolsData.length) {
        const poolConfigs = poolsData.map(({ poolConfig }) => poolConfig);

        const poolsInfo = await fetchRaydiumPoolsInfo(poolConfigs);

        const prices = poolsInfo.map((poolInfo, idx) => {
          const { amountOut } = getOutputAmount({
            poolKeys: poolConfigs?.[idx],
            poolInfo,
            payToken: poolTokensInfo?.[idx],
            payAmount: 1,
            receiveToken: SOL_TOKEN,
            slippage: new Percent(1, 100),
          });

          return amountOut;
        });

        setPrices(prices);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (poolDataByMint.size) {
      fetchPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityPoolsLoading, poolDataByMint]);

  return {
    loading: loading || liquidityPoolsLoading,
    prices,
  };
};
