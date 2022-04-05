import React, { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams, useHistory } from 'react-router';

import Button from '../../components/Button';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import NFTCheckbox from '../../components/NFTCheckbox';
import { SearchInput } from '../../components/SearchInput';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import Sidebar from './Sidebar';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import FraktionalizeTransactionModal from '../../components/FraktionalizeTransactionModal';
import { useWalletModal } from '../../contexts/WalletModal';
import {
  FraktionalizeTxnData,
  useFraktionalizeTransactionModal,
} from './hooks';
import { PATHS } from '../../constants';

const FraktionalizePage = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    nfts: rawNfts,
    loading: userTokensLoading,
    nftsLoading: loading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !loading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, loading]);

  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();
  const history = useHistory();

  const [searchString, setSearchString] = useState<string>('');
  const [selectedNfts, setSelectedNfts] = useState<UserNFT[]>([]);
  const {
    visible: txnModalVisible,
    open: openTxnModal,
    close: closeTxnModal,
    state: txnModalState,
    setState: setTxnModalState,
    fractionTokenMint,
    tickerName,
    addNftsToActiveVault,
  } = useFraktionalizeTransactionModal();
  const { itemsToShow, next, setItemsToShow } = useFakeInfinityScroll(15);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const onDeselect = (nft: UserNFT) => {
    setSelectedNfts(
      selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
    );
  };

  const onCardClick = (nft: UserNFT): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  const onContinueClick = ({
    newNfts = [],
    lockedNfts = [],
    tickerName,
    pricePerFraction,
    fractionsAmount,
    vaultName,
    vault,
  }: FraktionalizeTxnData) => {
    return openTxnModal({
      newNfts,
      lockedNfts,
      tickerName,
      pricePerFraction,
      fractionsAmount,
      vaultName,
      vault,
    }).then(() => {
      setSelectedNfts([]);
      history.push(PATHS.FRAKTIONALIZE);
    });
  };

  const nfts = useMemo(() => {
    return (rawNfts || []).filter(({ metadata }) =>
      metadata?.name.toUpperCase().includes(searchString),
    );
  }, [searchString, rawNfts]);

  const onTransactionModalCancel = () => {
    closeTxnModal();
    setTxnModalState('loading');
  };

  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        currentVaultPubkey={currentVaultPubkey}
        nfts={selectedNfts}
        onDeselect={onDeselect}
        onContinueClick={onContinueClick}
        addNftsToActiveVault={(params) =>
          addNftsToActiveVault(params).then(() => {
            setSelectedNfts([]);
            history.push(PATHS.FRAKTIONALIZE);
          })
        }
      />
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT(s)</h4>
          <SearchInput
            value={search}
            size="large"
            onChange={(e) => {
              setSearch(e.target.value || '');
              searchItems(e.target.value || '');
            }}
            className={styles.search}
            placeholder="Search by NFT name"
          />
          {!connected ? (
            <Button
              type="secondary"
              className={styles.connectBtn}
              onClick={() => setVisible(true)}
            >
              Connect wallet
            </Button>
          ) : (
            <FakeInfinityScroll
              itemsToShow={itemsToShow}
              next={next}
              isLoading={loading}
              wrapperClassName={styles.artsList}
              emptyMessage="No suitable NFTs found"
            >
              {nfts.map((nft) => (
                <NFTCheckbox
                  key={nft.mint}
                  onClick={() => onCardClick(nft)}
                  imageUrl={nft.metadata.image}
                  name={nft.metadata.name}
                  selected={
                    !!selectedNfts.find(
                      (selectedNft) => selectedNft?.mint === nft.mint,
                    )
                  }
                />
              ))}
            </FakeInfinityScroll>
          )}
        </div>
      </Container>
      <FraktionalizeTransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        tickerName={tickerName}
        fractionsMintAddress={fractionTokenMint}
        state={txnModalState}
      />
    </AppLayout>
  );
};

export default FraktionalizePage;
