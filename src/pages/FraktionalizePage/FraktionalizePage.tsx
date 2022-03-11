import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams, useHistory } from 'react-router';

import FraktionalizeTransactionModal from '../../components/FraktionalizeTransactionModal';
import { useSelectLayout } from '../../components/SelectLayout/hooks';
import { SelectLayout } from '../../components/SelectLayout';
import { useWalletModal } from '../../contexts/WalletModal';
import { SearchInput } from '../../components/SearchInput';
import NFTCheckbox from '../../components/NFTCheckbox';
import Button from '../../components/Button';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import {
  FraktionalizeTxnData,
  useFraktionalizeTransactionModal,
} from './hooks';
import { PATHS } from '../../constants';
import DetailsForm from './Sidebar/DetailsForm';
import { useSidebar } from './Sidebar/hooks';
import { UserNFT } from '../../contexts/userTokens';
import { DetailsFormDisabled } from './Sidebar/DetailsForm/DetailsFormDisabled';

const FraktionalizePage: FC = () => {
  const [search, setSearch] = useState('');
  const { connected } = useWallet();
  const history = useHistory();
  const { setVisible } = useWalletModal();
  const { itemsToShow, next } = useFakeInfinityScroll(15);
  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();

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

  const {
    onDeselect,
    onCardClick,
    selectedNfts,
    setSelectedNfts,
    nfts,
    searchItems,
    loading,
  } = useSelectLayout();

  const { currentVault, lockedNfts, isVaultActive } = useSidebar(
    currentVaultPubkey,
    nfts,
  );

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

  const onTransactionModalCancel = () => {
    closeTxnModal();
    setTxnModalState('loading');
  };

  return (
    <SelectLayout
      currentVaultPubkey={currentVaultPubkey}
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      sidebarForm={
        !isVaultActive ? (
          <DetailsForm
            onSubmit={({ ticker, pricePerFraktion, supply, vaultName }) => {
              const transformedLockedNfts: UserNFT[] = lockedNfts.map(
                ({
                  nftImage,
                  nftAttributes,
                  nftMint,
                  nftDescription,
                  nftName,
                }) => {
                  return {
                    mint: nftMint,
                    metadata: {
                      name: nftName,
                      symbol: '',
                      description: nftDescription,
                      image: nftImage,
                      animation_url: '',
                      external_url: '',
                      attributes: nftAttributes,
                      properties: null,
                    },
                  } as UserNFT;
                },
              );

              onContinueClick({
                newNfts: nfts,
                lockedNfts: transformedLockedNfts,
                tickerName: ticker,
                pricePerFraction: pricePerFraktion,
                fractionsAmount: Number(supply),
                vaultName,
                vault: currentVault,
              });
            }}
          />
        ) : (
          <DetailsFormDisabled
            vaultData={currentVault}
            continueBtnDisabled={!nfts.length}
            onSubmit={() =>
              addNftsToActiveVault({ vaultData: currentVault, nfts })
            }
          />
        )
      }
    >
      <h4 className={styles.title}>Select your NFT(s)</h4>
      <SearchInput
        value={search}
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
      <FraktionalizeTransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        tickerName={tickerName}
        fractionsMintAddress={fractionTokenMint}
        state={txnModalState}
      />
    </SelectLayout>
  );
};

export default FraktionalizePage;
