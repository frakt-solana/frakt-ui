import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import styles from './styles.module.scss';
import { ArrowDownSmallIcon, FiltersIcon } from '../../icons';
import { ControlledSelect } from '../../components/Select/Select';

import { Sidebar } from './components/Sidebar';
import { AppLayout } from '../../components/Layout/AppLayout';
import { HeaderBuy } from './components/HeaderBuy';
import { HeaderStateProvider } from '../../contexts/HeaderState';
import { usePublicKeyParam } from '../../hooks';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../contexts/nftPools';
import { Loader } from '../../components/Loader';
import { UserNFT } from '../../contexts/userTokens';
import { NFTsList } from '../../components/NFTsList';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../utils/cacher/nftPools/nftPools.helpers';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { publicKey, struct, u64, u8 } from '@raydium-io/raydium-sdk';

export const LOTTERY_TICKET_ACCOUNT_LAYOUT = struct([
  u64('anchor_start'),
  publicKey('community_pool'),
  publicKey('ticket_holder'),
  publicKey('winning_safety_box'),
  u64('lottery_ticket_state'),
  u8('anchor_end'),
]);

const useLotteryTicketSubscription = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const subscriptionId = useRef<number>();

  const subscribe = (
    lotteryTicketPublicKey: PublicKey,
    callback: (value: string) => void,
  ) => {
    subscriptionId.current = connection.onAccountChange(
      lotteryTicketPublicKey,
      (lotteryTicketAccountEncoded) => {
        const x = LOTTERY_TICKET_ACCOUNT_LAYOUT.decode(
          lotteryTicketAccountEncoded.data,
        );

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

const MarketBuyPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  const { getLotteryTicket } = useNftPools();
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);

  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const { control /* watch */ } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  const nfts: UserNFT[] = useMemo(() => {
    if (pool) {
      return pool.safetyBoxes.map(safetyDepositBoxWithNftMetadataToUserNFT);
    }
    return [];
  }, [pool]);

  const { subscribe } = useLotteryTicketSubscription();

  const onBuy = async () => {
    const lotteryTicketPubkey = await getLotteryTicket({ pool });

    // eslint-disable-next-line no-console
    subscribe(lotteryTicketPubkey, (saferyBoxPublicKey: string) =>
      console.log(
        pool.safetyBoxes.find(
          ({ publicKey }) => publicKey.toBase58() === saferyBoxPublicKey,
        ),
      ),
    );
    // //? Run roulette
    // //? subscribe to changes
    // // eslint-disable-next-line no-console
    // console.log(lotteryTicketPubkey?.toBase58());
  };

  return (
    <HeaderStateProvider>
      <AppLayout className={styles.layout}>
        <div className="container">
          <Helmet>
            <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
          </Helmet>
          <div className={styles.wrapper}>
            <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

            <div className={styles.content}>
              <HeaderBuy poolPublicKey={poolPubkey} onBuy={onBuy} />

              <div className={styles.itemsSortWrapper}>
                <p
                  className={styles.filtersIconWrapper}
                  onClick={() => setIsSidebar(true)}
                >
                  Filters
                  <FiltersIcon />
                </p>
                <div className={styles.itemsAmount}>355 items</div>
                <div className={styles.sortWrapper}>
                  <ControlledSelect
                    className={styles.sortingSelect}
                    valueContainerClassName={styles.sortingSelectValueContainer}
                    label="Sort by"
                    control={control}
                    name="sort"
                    options={SORT_VALUES}
                  />
                </div>
              </div>
              {poolLoading ? <Loader /> : <NFTsList nfts={nfts} />}
            </div>
          </div>
        </div>
      </AppLayout>
    </HeaderStateProvider>
  );
};

export default MarketBuyPage;

const SORT_VALUES = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
];
