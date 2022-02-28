import { NftPoolData } from './../../utils/cacher/nftPools/nftPools.model';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { UserNFTWithCollection } from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useUserSplAccount } from '../../utils/accounts';
import { SORT_VALUES } from './components/MarketNFTsList';
import { LOTTERY_TICKET_ACCOUNT_LAYOUT } from './constants';
import { FilterFormFieldsValues, FilterFormInputsNames } from './model';

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
          const x = LOTTERY_TICKET_ACCOUNT_LAYOUT.decode(
            lotteryTicketAccountEncoded.data,
          );

          // eslint-disable-next-line no-console
          console.log({
            community_pool: x.community_pool.toBase58(),
            ticket_holder: x.ticket_holder.toBase58(),
            winning_safety_box: x.winning_safety_box.toBase58(),
            lottery_ticket_state: x.lottery_ticket_state,
          });

          //TODO lotteryTicketAccountEncoded check

          callback(x.winning_safety_box.toBase58());
          // unsubscribe()
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
