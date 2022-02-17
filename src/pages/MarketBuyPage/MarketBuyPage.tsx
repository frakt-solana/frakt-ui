import { useEffect, useMemo, useState } from 'react';
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
import { useNftPool, useNftPools } from '../../contexts/nftPools';
import { Loader } from '../../components/Loader';
import { UserNFT } from '../../contexts/userTokens';
import { NFTsList } from '../../components/NFTsList';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../utils/cacher/nftPools/nftPools.helpers';

const MarketBuyPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  const { getLotteryTicket } = useNftPools();

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

  const buyRandomNft = async () => {
    const lotteryTicketPubkey = await getLotteryTicket({ pool });
    //? Run roulette
    //? subscribe to changes
    // eslint-disable-next-line no-console
    console.log(lotteryTicketPubkey);
  };

  useEffect(() => {
    buyRandomNft();
  }, []);

  // const sort = watch('sort');

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
              <HeaderBuy poolPublicKey={poolPubkey} />

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
