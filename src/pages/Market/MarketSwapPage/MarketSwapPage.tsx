import { FC, useState } from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles.module.scss';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { HeaderSwap } from './components/HeaderSwap';
import { SwappingModal } from './components/SwappingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../../../components/WalletNotConnected';
import { useParams } from 'react-router-dom';
import { usePublicKeyParam } from '../../../hooks';
import { useNftPoolsInitialFetch } from '../../../contexts/nftPools';
import { Sidebar } from '../components/Sidebar';

export const MarketSwapPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

  // const { depositNftToCommunityPool } = useNftPools();

  // const { pool, whitelistedMintsDictionary } = useNftPool(poolPubkey);
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

  // const sort = watch('sort');

  return (
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
          <Sidebar
            isSidebar={isSidebar}
            setIsSidebar={setIsSidebar}
            setSearch={(value) => value}
          />

          <div className={styles.content}>
            <HeaderSwap poolPublicKey={poolPubkey} />

            {!connected && <WalletNotConnected />}

            {/* {connected && !loading && (
              <MarketNFTsList
                nfts={nfts}
                setIsSidebar={setIsSidebar}
                control={control}
                sortFieldName={FormInputsNames.SORT}
                sortValues={SORT_VALUES}
                onCardClick={onSelect}
                selectedNft={selectedNft}
              />
            )}

            {connected && loading && <Loader size="large" />} */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
