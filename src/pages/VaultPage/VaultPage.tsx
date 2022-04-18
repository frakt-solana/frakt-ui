import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
  VaultData,
  VaultState,
} from '../../contexts/fraktion';
import { InfoTable } from './InfoTable/InfoTable';
import styles from './styles.module.scss';
import { BuyoutTab } from './BuyoutTab';
import { useTokensMap } from '../../contexts/TokenList';
import { TradeTab } from './TradeTab/TradeTab';
import { SwapTab } from './SwapTab/SwapTab';
import { DetailsHeader } from './DetailsHeader/DetailsHeader';
import { BackToVaultsListButton } from './BackToVaultsListButton';
import NavigationLink from '../../components/Header/NavigationLink';
import { PATHS } from '../../constants';
import { NFTList } from './NFTList';
import { CollectionData, fetchCollectionsData } from '../../utils/collections';
import { NFTDoubleSlider } from './NFTDoubleSlider';
import { RedeemNftsFromUnfinishedVault } from './RedeemNftsFromUnfinishedVault';
import Button from '../../components/Button';
import { Tabs, useTabs } from '../../components/Tabs';

const VaultPage: FC = () => {
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  useFraktionInitialFetch();
  useFraktionPolling();

  const {
    tabs,
    setValue: setTabValue,
    value: tabValue,
  } = useTabs({
    tabs: [
      {
        label: 'Trade',
        value: 'trade',
      },
      {
        label: 'Swap',
        value: 'swap',
      },
      {
        label: 'Buyout',
        value: 'buyout',
      },
    ],
    defaultValue: 'trade',
  });

  const [allNftsCollectionInfo, setAllNftsCollectionInfo] = useState<
    CollectionData[]
  >([]);
  const wallet = useWallet();

  const tokensMap = useTokensMap();
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

  const collections = (vaultData?.safetyBoxes || []).map(
    (nft) => nft.nftCollectionName,
  );

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
        name: tokensMap.get(vaultData.fractionMint)?.name || '',
        symbol: tokensMap.get(vaultData.fractionMint)?.symbol || '',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensMap, vaultData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //? Set active tab "Buyout" if auction started
  useEffect(() => {
    if (vaultData) {
      const isAuctionStarted = vaultData.auction.auction?.isStarted;
      isAuctionStarted && setTabValue('buyout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  useEffect(() => {
    setCurrentSlideData({
      nftName: initSlideNftName,
      nftIndex: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData?.safetyBoxes.length]);

  const onSlideThumbClick =
    (nftName: string, nftCollectionName: string, nftIndex: number) => () => {
      setCurrentSlideData({
        nftName,
        nftIndex: nftIndex + 1,
      });
    };

  const isVaultArchived = vaultData?.state === VaultState.Archived;
  const vaultHasBidHistory = !!vaultData?.auction?.bids?.length;

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
          <>
            <div className={styles.content}>
              <div className={styles.col}>
                <NFTDoubleSlider
                  vaultData={vaultData}
                  safetyBoxes={vaultData?.safetyBoxes}
                  onSlideThumbClick={onSlideThumbClick}
                  currentSlideData={currentSlideData}
                />
                <DetailsHeader
                  className={styles.detailsHeaderMobile}
                  vaultData={vaultData}
                  vaultTitleData={vaultTitleData}
                />
              </div>
              <div className={styles.details}>
                <DetailsHeader
                  className={styles.detailsHeaderDesc}
                  vaultData={vaultData}
                  vaultTitleData={vaultTitleData}
                />
                {vaultData.state === VaultState.Inactive &&
                  !!vaultData.safetyBoxes.length && (
                    <RedeemNftsFromUnfinishedVault vaultData={vaultData} />
                  )}
                {vaultData.state === VaultState.Inactive && (
                  <div className={styles.btnItem}>
                    <NavigationLink
                      to={`${PATHS.FRAKTIONALIZE}/${vaultPubkey}`}
                    >
                      Add NFTs and launch vault
                    </NavigationLink>
                  </div>
                )}
                {vaultData && (
                  <InfoTable
                    vaultInfo={vaultData}
                    marketId={vaultMarket?.address}
                  />
                )}

                {!isVaultArchived && (
                  <>
                    <Tabs tabs={tabs} value={tabValue} setValue={setTabValue} />
                    <div className={styles.tabContent}>
                      {tabValue === 'trade' && (
                        <TradeTab
                          vaultInfo={vaultData}
                          tokerName={vaultTitleData.symbol}
                          vaultMarketAddress={vaultMarket?.address}
                        />
                      )}
                      {tabValue === 'swap' && (
                        <SwapTab
                          vaultMarketAddress={vaultMarket?.address}
                          fractionMint={vaultData.fractionMint}
                          vaultLockedPrice={vaultData.lockedPricePerShare}
                        />
                      )}
                      {tabValue === 'buyout' && (
                        <BuyoutTab vaultInfo={vaultData} />
                      )}
                    </div>
                  </>
                )}

                {isVaultArchived && vaultHasBidHistory && (
                  <BuyoutTab vaultInfo={vaultData} />
                )}
              </div>
            </div>
            <section id="allNftList" className={styles.allNfts}>
              <h4 className={styles.nftsTitle}>
                <span>{vaultData?.safetyBoxes.length}</span>
                NFTs inside the vault
                {wallet.publicKey?.toBase58() === vaultData?.authority &&
                  vaultData?.realState === VaultState.Active && (
                    <NavLink
                      to={`${PATHS.FRAKTIONALIZE}/${vaultPubkey}`}
                      className={styles.addNftsLink}
                    >
                      <Button>Add NFTs</Button>
                    </NavLink>
                  )}
              </h4>
              <NFTList
                safetyBoxes={vaultData?.safetyBoxes}
                nftCollections={allNftsCollectionInfo}
              />
            </section>
          </>
        )}
      </Container>
    </AppLayout>
  );
};

export default VaultPage;
