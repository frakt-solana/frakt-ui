import { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { shuffle } from 'lodash';

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
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import {
  useLotteryTicketSubscription,
  useNFTsFiltering,
  usePoolTokensPrices,
} from '../hooks';
import { FilterFormInputsNames } from '../model';
import { LotteryModal, useLotteryModal } from '../components/LotteryModal';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';

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

export const NFTPoolBuyPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const {
    priceByTokenMint: poolTokenPriceByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const [, setIsSidebar] = useState<boolean>(false);

  const rawNFTs: UserNFTWithCollection[] = useMemo(() => {
    if (pool) {
      return pool.safetyBoxes.map((safetyBox) => ({
        ...safetyDepositBoxWithNftMetadataToUserNFT(safetyBox),
        collectionName: safetyBox?.nftCollectionName || '',
      }));
    }
    return [];
  }, [pool]);

  const { control, nfts } = useNFTsFiltering(rawNFTs);

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

  const loading = poolLoading || !pool || tokensMapLoading || pricesLoading;

  const Header = useCallback(
    () => (
      <HeaderBuy
        pool={pool}
        onBuy={onBuy}
        poolTokenInfo={poolTokenInfo}
        poolTokenPrice={poolTokenPriceByTokenMint.get(poolTokenInfo?.address)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poolPublicKey, pricesLoading],
  );

  return (
    <NFTPoolPageLayout
      CustomHeader={loading ? null : Header}
      pageType={PoolPageType.BUY}
    >
      {loading ? (
        <Loader size="large" />
      ) : (
        <NFTPoolNFTsList
          nfts={nfts}
          setIsSidebar={setIsSidebar}
          control={control}
          sortFieldName={FilterFormInputsNames.SORT}
          sortValues={SORT_VALUES}
          poolName={poolTokenInfo?.name || ''}
        />
      )}
      {isLotteryModalVisible && (
        <LotteryModal
          setIsVisible={setIsLotteryModalVisible}
          prizeImg={prizeImg}
          setPrizeImg={setPrizeImg}
          nftImages={getNftImagesForLottery(nfts)}
        />
      )}
    </NFTPoolPageLayout>
  );
};
