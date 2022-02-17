import { useParams } from 'react-router';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';

import { ArrowDownSmallIcon, FiltersIcon } from '../../icons';
import { ControlledSelect } from '../../components/Select/Select';
import { Sidebar } from './components/Sidebar';
import { NFTsList } from '../../components/NFTsList';
import { AppLayout } from '../../components/Layout/AppLayout';
import { HeaderSell } from './components/HeaderSell';
import { HeaderStateProvider } from '../../contexts/HeaderState';
import { SellingModal } from './components/SellingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../../components/WalletNotConnected';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { Loader } from '../../components/Loader';
import styles from './styles.module.scss';

import {
  useNftPool,
  useNftPools,
} from '../../contexts/nftPools/nftPools.hooks';
import { usePublicKeyParam } from '../../hooks';
import { PublicKey } from '@solana/web3.js';

const MarketSellPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  const { depositNftToCommunityPool } = useNftPools();

  const { pool, whitelistedMintsDictionary } = useNftPool(poolPubkey);
  const { nfts: rawNfts, loading: userNftsLoading } = useUserTokens();

  const { connected } = useWallet();
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };
  const onDeselect = () => {
    setSelectedNft(null);
  };
  const onSell = () => {
    //TODO Remove NFT from list after successfull selling
    depositNftToCommunityPool({
      pool,
      nftMint: new PublicKey(selectedNft?.mint),
    });
  };

  const { control /* watch */ } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  // const sort = watch('sort');

  const nfts = useMemo(() => {
    return rawNfts.filter(({ mint }) => !!whitelistedMintsDictionary[mint]);
  }, [rawNfts, whitelistedMintsDictionary]);

  return (
    <HeaderStateProvider>
      <AppLayout className={styles.layout}>
        <div className={styles.modalWrapper}>
          <SellingModal
            nft={selectedNft}
            onDeselect={onDeselect}
            onSubmit={onSell}
          />
        </div>
        <div className="container">
          <Helmet>
            <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
          </Helmet>
          <div className={styles.wrapper}>
            <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

            <div className={styles.content}>
              <HeaderSell poolPublicKey={poolPubkey} />

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

                  {userNftsLoading ? (
                    <Loader />
                  ) : (
                    <NFTsList onCardClick={onSelect} nfts={nfts} />
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
