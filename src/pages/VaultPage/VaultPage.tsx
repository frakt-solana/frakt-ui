import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import classNames from 'classnames/bind';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import { useFraktion, VaultData, VaultState } from '../../contexts/fraktion';
import { InfoTable } from './InfoTable/InfoTable';
import styles from './styles.module.scss';
import { BuyoutTab } from './BuyoutTab';
import { useTokenMap } from '../../contexts/TokenList';
import { TradeTab } from './TradeTab/TradeTab';
import { SwapTab } from './SwapTab/SwapTab';
import { DetailsHeader } from './DetailsHeader/DetailsHeader';
import { BackToVaultsListButton } from './BackToVaultsListButton';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import NavigationLink from '../../components/Header/NavigationLink';
import { URLS } from '../../constants';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

const VaultPage: FC = () => {
  const [tab, setTab] = useState<tabType>('trade');
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const tokenMap = useTokenMap();
  const vaultData: VaultData = useMemo(() => {
    return vaults.find(
      ({ vaultPubkey: publicKey }) => publicKey === vaultPubkey,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);
  const [currentNftName, setCurrentNftName] = useState(
    'Dont forget to init starting value',
  );

  const vaultMarket = useMemo(() => {
    return vaultsMarkets.find(
      ({ baseMint }) => baseMint === vaultData.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  const [tokerName, setTokerName] = useState<string>('');

  useEffect(() => {
    !loading &&
      vaultData &&
      setTokerName(tokenMap.get(vaultData.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultData]);

  const { nftAttributes, nftDescription, nftImage } =
    vaultData?.safetyBoxes.length >= 1
      ? vaultData.safetyBoxes[0]
      : {
          nftAttributes: null,
          nftDescription: null,
          nftImage: null,
        };

  //? Set active tab "Buyout" if auction started
  useEffect(() => {
    if (vaultData) {
      const isAuctionStarted = vaultData.auction.auction?.isStarted;
      isAuctionStarted && setTab('buyout');
    }
  }, [vaultData]);

  return (
    <AppLayout>
      <Container component="main" className={styles.wrapper}>
        <BackToVaultsListButton className={styles.goBackBtn} />
        {loading && (
          <div className={styles.loading}>
            <Loader size="large" />
          </div>
        )}
        {!loading && !!vaultData && (
          <div className={styles.content}>
            <div className={styles.col}>
              <div className={styles.sliders}>
                <Swiper
                  slidesPerView={1}
                  className={styles.sliderBig}
                  thumbs={{ swiper: thumbsSwiper }}
                >
                  {vaultData?.safetyBoxes.map((box) => (
                    <SwiperSlide key={box.vaultPubkey}>
                      <div
                        className={styles.slideBig}
                        style={{ backgroundImage: `url(${box.nftImage})` }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {vaultData?.safetyBoxes.length > 1 && (
                  <>
                    <Swiper
                      slidesPerView={4.7}
                      className={styles.sliderSmall}
                      navigation={true}
                      scrollbar={true}
                      onSwiper={setThumbsSwiper}
                    >
                      {vaultData?.safetyBoxes.map((box) => (
                        <SwiperSlide
                          key={box.vaultPubkey}
                          onClick={() => setCurrentNftName(box.nftName)}
                        >
                          <div
                            className={styles.slideSmall}
                            style={{ backgroundImage: `url(${box.nftImage})` }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <p className={styles.nftName}>{currentNftName}</p>
                  </>
                )}
              </div>
              <DetailsHeader
                className={styles.detailsHeaderMobile}
                vaultData={vaultData}
                tokerName={tokerName}
              />
              {!!nftDescription && (
                <div className={styles.mainInfoWrapper}>
                  <div className={styles.description}>{nftDescription}</div>
                </div>
              )}
              {!!nftAttributes?.length && vaultData?.safetyBoxes.length === 1 && (
                <div className={styles.attributesTable}>
                  {nftAttributes.map(({ trait_type, value }, idx) => (
                    <div key={idx} className={styles.attributesTable__row}>
                      <p>{trait_type}</p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.details}>
              <DetailsHeader
                className={styles.detailsHeaderDesc}
                vaultData={vaultData}
                tokerName={tokerName}
              />
              {vaultData.state === VaultState.Inactive && (
                <div className={styles.btnItem}>
                  <NavigationLink to={`${URLS.FRAKTIONALIZE}/${vaultPubkey}`}>
                    Add NFTs and launch vault
                  </NavigationLink>
                </div>
              )}
              {vaultData.state === VaultState.Active && (
                <InfoTable
                  vaultInfo={vaultData}
                  marketId={vaultMarket?.address}
                />
              )}
              {/* //? Show tabs if vault active or bought */}
              {(vaultData.state === VaultState.Active ||
                vaultData.state === VaultState.AuctionFinished ||
                vaultData.state === VaultState.AuctionLive) && (
                <>
                  <Tabs tab={tab} setTab={setTab} />
                  <div className={styles.tabContent}>
                    {tab === 'trade' && (
                      <TradeTab
                        vaultInfo={vaultData}
                        tokerName={tokerName}
                        vaultMarketAddress={vaultMarket?.address}
                      />
                    )}
                    {tab === 'swap' && (
                      <SwapTab fractionMint={vaultData.fractionMint} />
                    )}
                    {tab === 'buyout' && <BuyoutTab vaultInfo={vaultData} />}
                  </div>
                </>
              )}
              {vaultData.state === VaultState.Archived && (
                <div className={styles.detailsPlaceholder} />
              )}
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

type tabType = 'trade' | 'swap' | 'buyout';

interface TabsProps {
  tab: tabType;
  setTab: (tab: tabType) => void;
}

const Tabs: FC<TabsProps> = ({ tab, setTab }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'trade' },
        ])}
        name="trade"
        onClick={() => setTab('trade')}
      >
        Trade
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'swap' },
        ])}
        name="swap"
        onClick={() => setTab('swap')}
      >
        Swap
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'buyout' },
        ])}
        name="buyout"
        onClick={() => setTab('buyout')}
      >
        Buyout
      </button>
    </div>
  );
};

export default VaultPage;
