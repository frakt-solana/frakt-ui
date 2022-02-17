import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles.module.scss';
import { ArrowDownSmallIcon, FiltersIcon } from '../../icons';
import { ControlledSelect } from '../../components/Select/Select';
import { useForm } from 'react-hook-form';

import { Sidebar } from './components/Sidebar';
import { AppLayout } from '../../components/Layout/AppLayout';
import { HeaderSwap } from './components/HeaderSwap';
import { HeaderStateProvider } from '../../contexts/HeaderState';
import { SwappingModal } from './components/SwappingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../../components/WalletNotConnected';
import { useParams } from 'react-router-dom';
import { usePublicKeyParam } from '../../hooks';

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

const MarketSwapPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  const { connected } = useWallet();
  const [isPrivetNFTsList, setIsPrivetNFTsList] = useState<boolean>(true);
  const [selectedSwapFrom, setSelectedSwapFrom] = useState(null);
  const [selectedSwapTo, setSelectedSwapTo] = useState(null);
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const onDeselect = (isFrom: boolean) => {
    isFrom ? setSelectedSwapFrom(null) : setSelectedSwapTo(null);
  };

  const changeNFTsList = (isPrivetNFTsListNeeded: boolean) => {
    isPrivetNFTsListNeeded
      ? setIsPrivetNFTsList(true)
      : setIsPrivetNFTsList(false);
  };

  const { control /* watch */ } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  // const sort = watch('sort');

  return (
    <HeaderStateProvider>
      <AppLayout className={styles.layout}>
        {connected && (
          <div className={styles.modalWrapper}>
            <SwappingModal
              selectedSwapFrom={selectedSwapFrom}
              selectedSwapTo={selectedSwapTo}
              isPrivetNFTsList={isPrivetNFTsList}
              changeNFTsList={changeNFTsList}
              onDeselect={onDeselect}
            />
          </div>
        )}
        <div className="container">
          <Helmet>
            <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
          </Helmet>
          <div className={styles.wrapper}>
            <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />

            <div className={styles.content}>
              <HeaderSwap poolPublicKey={poolPubkey} />

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

                  {/* {isPrivetNFTsList ? (
                    <NFTsList
                      selectedNFT={selectedSwapFrom}
                      onCardClick={onCardClick}
                      nfts={NFTs_FROM_DATA}
                      onNftItemClick={onNftItemClick}
                    />
                  ) : (
                    <NFTsList
                      selectedNFT={selectedSwapTo}
                      onCardClick={onCardClick}
                      nfts={NFTs_TO_DATA}
                      onNftItemClick={onNftItemClick}
                    />
                  )} */}
                </>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </HeaderStateProvider>
  );
};

export default MarketSwapPage;
