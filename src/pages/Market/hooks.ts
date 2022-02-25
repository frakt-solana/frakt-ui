import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useRef } from 'react';
import { Control, useForm } from 'react-hook-form';

import { UserNFTWithCollection } from '../../contexts/userTokens';
import { SORT_VALUES } from './components/MarketNFTsList';
import { LOTTERY_TICKET_ACCOUNT_LAYOUT } from './constants';
import { FilterFormFieldsValues, FilterFormInputsNames } from './model';

type UseNFTsFiltering = (nfts: UserNFTWithCollection[]) => {
  control: Control<FilterFormFieldsValues>;

  nfts: UserNFTWithCollection[];
};

export const useNFTsFiltering: UseNFTsFiltering = (nfts) => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const filteredNfts = useMemo(() => {
    if (nfts.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return [...nfts].sort((nftA, nftB) => {
        if (sortField === 'name') {
          if (sortOrder === 'asc')
            return nftA?.metadata?.name?.localeCompare(nftB?.metadata?.name);
          return nftB?.metadata?.name?.localeCompare(nftA?.metadata?.name);
        }
        return 0;
      });
    }

    return [];
  }, [nfts, sort]);

  return { control, nfts: filteredNfts };
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
