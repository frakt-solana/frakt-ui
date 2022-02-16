import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';

import { ArrowDownSmallIcon, FiltersIcon } from '../../icons';
import { ControlledSelect } from '../../components/Select/Select';
import { Sidebar } from './components/Sidebar';
import { NFTsList } from './components/NFTsList';
import { AppLayout } from '../../components/Layout/AppLayout';
import { HeaderSell } from './components/HeaderSell';
import { HeaderStateProvider } from '../../contexts/HeaderState';
import { SellingModal } from './components/SellingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../../components/WalletNotConnected';
import { useUserTokens } from '../../contexts/userTokens';
import { Loader } from '../../components/Loader';
import styles from './styles.module.scss';

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

const MarketSellPage = (): JSX.Element => {
  const { connected } = useWallet();
  const [selectedNfts, setSelectedNfts] = useState<any>([]);

  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const onDeselect = (nft: any) => {
    setSelectedNfts(
      selectedNfts.filter((selectedNft) => selectedNft?.nftId !== nft.nftId),
    );
  };

  const onCardClick = (nft: any): void => {
    selectedNfts.find((selectedNft) => selectedNft?.nftId === nft.nftId)
      ? setSelectedNfts(
          selectedNfts.filter(
            (selectedNft) => selectedNft?.nftId !== nft.nftId,
          ),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const { control /* watch */ } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  // const sort = watch('sort');

  const { nfts, loading } = useUserTokens();

  return (
    <HeaderStateProvider>
      <AppLayout className={styles.layout}>
        <div className={styles.modalWrapper}>
          <SellingModal nfts={selectedNfts} onDeselect={onDeselect} />
        </div>
        <div className="container">
          <Helmet>
            <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
          </Helmet>
          <div className={styles.wrapper}>
            <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

            <div className={styles.content}>
              <HeaderSell />

              {!connected ? (
                <WalletNotConnected />
              ) : (
                <>
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
                        valueContainerClassName={
                          styles.sortingSelectValueContainer
                        }
                        label="Sort by"
                        control={control}
                        name="sort"
                        options={SORT_VALUES}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <Loader />
                  ) : (
                    <NFTsList onCardClick={onCardClick} nfts={nfts} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </HeaderStateProvider>
  );
};

export default MarketSellPage;
