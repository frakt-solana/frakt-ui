import { FC, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';

import styles from './styles.module.scss';
import { SidebarInner } from '../components/SidebarInner';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { HeaderBuy } from './components/HeaderBuy';
import { usePublicKeyParam } from '../../../hooks';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { Loader } from '../../../components/Loader';
import { UserNFTWithCollection } from '../../../contexts/userTokens';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../../utils/cacher/nftPools/nftPools.helpers';
import { MarketNFTsList, SORT_VALUES } from '../components/MarketNFTsList';
import { useLotteryTicketSubscription, useNFTsFiltering } from '../hooks';
import { FilterFormInputsNames } from '../model';

export const MarketBuyPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);

  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const rawNFTs: UserNFTWithCollection[] = useMemo(() => {
    if (pool) {
      return pool.safetyBoxes.map((safetyBox) => ({
        ...safetyDepositBoxWithNftMetadataToUserNFT(safetyBox),
        collectionName: safetyBox?.nftCollectionName || '',
      }));
    }
    return [];
  }, [pool]);

  const { control, nfts, setSearch } = useNFTsFiltering(rawNFTs);

  const { getLotteryTicket } = useNftPools();
  const { subscribe } = useLotteryTicketSubscription();

  const onBuy = async () => {
    const lotteryTicketPubkey = await getLotteryTicket({ pool });

    lotteryTicketPubkey &&
      subscribe(lotteryTicketPubkey, (saferyBoxPublicKey) => {
        // eslint-disable-next-line no-console
        console.log(saferyBoxPublicKey, '!');
      });
    // //? Run roulette
    // //? subscribe to changes
    // // eslint-disable-next-line no-console
    // console.log(lotteryTicketPubkey?.toBase58());
  };

  return (
    <AppLayout className={styles.layout}>
      <div className="container">
        <Helmet>
          <title>Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana</title>
        </Helmet>

        <div className={styles.wrapper}>
          {poolLoading || !pool ? (
            <Loader size="large" />
          ) : (
            <>
              <SidebarInner
                isSidebar={isSidebar}
                setIsSidebar={setIsSidebar}
                setSearch={setSearch}
              />
              <div className={styles.content}>
                <HeaderBuy pool={pool} onBuy={onBuy} />
                <MarketNFTsList
                  nfts={nfts}
                  setIsSidebar={setIsSidebar}
                  control={control}
                  sortFieldName={FilterFormInputsNames.SORT}
                  sortValues={SORT_VALUES}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
