import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

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
import NavigationLink from '../../components/Header/NavigationLink';
import { URLS } from '../../constants';
import { NFTList } from './NFTList';
import {
  CollectionData,
  fetchCollectionData,
  fetchCollectionsData,
} from '../../utils/collections';
import { getCollectionThumbnailUrl } from '../../utils';
import { NFTDoubleSlider } from './NFTDoubleSlider';

const VaultPage: FC = () => {
  const [tab, setTab] = useState<tabType>('trade');
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  const [currentNftCollectionInfo, setCurrentNftCollectionInfo] =
    useState<CollectionData>(null);
  const [allNftsCollectionInfo, setAllNftsCollectionInfo] = useState<
    CollectionData[]
  >([]);

  const tokenMap = useTokenMap();
  const vaultData: VaultData = useMemo(() => {
    return vaults.find(
      ({ vaultPubkey: publicKey }) => publicKey === vaultPubkey,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);
  const initSlideNftName = vaultData?.safetyBoxes[0]?.nftName || '';
  const [currentSlideData, setCurrentSlideData] = useState<{
    nftName: string;
    nftIndex: number;
  }>({
    nftName: '',
    nftIndex: 1,
  });
  const sortedSafetyBoxes = useMemo(() => {
    return vaultData?.safetyBoxes
      ? [...vaultData.safetyBoxes].sort((a, b) => {
          return a.nftName.localeCompare(b.nftName);
        })
      : [];
  }, [vaultData]);

  const collections = sortedSafetyBoxes.map((nft) => nft.nftCollectionName);

  const vaultMarket = useMemo(() => {
    return vaultsMarkets?.find(
      ({ baseMint }) => baseMint === vaultData.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  const [vaultTitleData, setVaultTitleData] = useState<{
    name: string;
    symbol: string;
  }>({ name: '', symbol: '' });

  useEffect(() => {
    !loading &&
      vaultData &&
      setVaultTitleData({
        name: tokenMap.get(vaultData.fractionMint)?.name || '',
        symbol: tokenMap.get(vaultData.fractionMint)?.symbol || '',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultData]);

  const { nftAttributes, nftDescription } =
    vaultData?.safetyBoxes.length >= 1
      ? vaultData.safetyBoxes[0]
      : {
          nftAttributes: null,
          nftDescription: null,
        };

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchCollectionsData(collections);
        if (result) {
          setAllNftsCollectionInfo(result);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    setCurrentNftCollectionInfo(allNftsCollectionInfo[0]);
  }, [allNftsCollectionInfo]);

  //? Set active tab "Buyout" if auction started
  useEffect(() => {
    if (vaultData) {
      const isAuctionStarted = vaultData.auction.auction?.isStarted;
      isAuctionStarted && setTab('buyout');
    }
  }, [vaultData]);

  useEffect(() => {
    setCurrentSlideData({
      nftName: initSlideNftName,
      nftIndex: 1,
    });
  }, [vaultData?.safetyBoxes.length]);

  const onSlideThumbClick =
    (nftName: string, nftCollectionName: string, nftIndex: number) => () => {
      const currentSlideCollection = allNftsCollectionInfo.find(
        (coll) => coll.collectionName === nftCollectionName,
      );
      setCurrentNftCollectionInfo(currentSlideCollection);
      setCurrentSlideData({
        nftName,
        nftIndex: nftIndex + 1,
      });
    };

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
              <NFTDoubleSlider
                vaultData={vaultData}
                sortedSafetyBoxes={sortedSafetyBoxes}
                onSlideThumbClick={onSlideThumbClick}
                currentSlideData={currentSlideData}
              />
              <DetailsHeader
                className={styles.detailsHeaderMobile}
                vaultData={vaultData}
                vaultTitleData={vaultTitleData}
              />
              <div className={styles.mainInfoWrapper}>
                {currentNftCollectionInfo && (
                  <NavLink
                    to={`${URLS.COLLECTION}/${currentNftCollectionInfo?.collectionName}`}
                    className={styles.collectionLink}
                  >
                    <div
                      className={styles.collectionIcon}
                      style={{
                        backgroundImage: `url(${getCollectionThumbnailUrl(
                          currentNftCollectionInfo?.thumbnailPath,
                        )})`,
                      }}
                    />
                    <p className={styles.collectionName}>
                      {currentNftCollectionInfo?.collectionName}
                    </p>
                  </NavLink>
                )}
                {!!nftDescription && (
                  <div className={styles.mainInfoWrapper}>
                    <div className={styles.description}>{nftDescription}</div>
                  </div>
                )}
              </div>
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
                vaultTitleData={vaultTitleData}
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
                        tokerName={vaultTitleData.symbol}
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
        {vaultData?.safetyBoxes.length > 1 && (
          <section id="allNftList" className={styles.allNfts}>
            <h4 className={styles.nftsTitle}>
              <span>{vaultData?.safetyBoxes.length}</span>
              NFTs inside the vault
            </h4>
            <NFTList
              safetyBoxes={sortedSafetyBoxes}
              nftCollections={allNftsCollectionInfo}
            />
          </section>
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
