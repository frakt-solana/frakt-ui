import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { shuffle } from 'lodash';

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
import { LotteryModal, useLotteryModal } from '../components/LotteryModal';

export const getNftImagesForLottery = (
  nfts: UserNFTWithCollection[],
): string[] => {
  const ARRAY_SIZE = 20;

  const shuffled = shuffle(nfts.map(({ metadata }) => metadata.image));

  if (shuffled.length >= ARRAY_SIZE) {
    return shuffled.slice(0, ARRAY_SIZE);
  }

  return shuffled;
};

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

  const {
    isLotteryModalVisible,
    setIsLotteryModalVisible,
    prizeImg,
    setPrizeImg,
    openLotteryModal,
  } = useLotteryModal();

  const onBuy = async () => {
    const lotteryTicketPubkey = await getLotteryTicket({ pool });
    openLotteryModal();

    lotteryTicketPubkey &&
      subscribe(lotteryTicketPubkey, (saferyBoxPublicKey) => {
        if (saferyBoxPublicKey === '11111111111111111111111111111111') {
          return;
        }

        const nftImage =
          pool.safetyBoxes.find(
            ({ publicKey }) => publicKey.toBase58() === saferyBoxPublicKey,
          )?.nftImage || '';

        setPrizeImg(nftImage);
      });
  };

  return (
    <AppLayout className={styles.layout}>
      <div className="container">
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
      {isLotteryModalVisible && (
        <LotteryModal
          setIsVisible={setIsLotteryModalVisible}
          prizeImg={prizeImg}
          setPrizeImg={setPrizeImg}
          nftImages={getNftImagesForLottery(nfts)}
        />
      )}
    </AppLayout>
  );
};
