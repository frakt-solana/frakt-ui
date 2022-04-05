import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { SearchInput } from '../../components/SearchInput';
import BorrowForm from './BorrowForm';
import NFTCheckbox from '../../components/NFTCheckbox';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { useBorrowPage } from './hooks';

const BorrowPage: FC = () => {
  const { connected } = useWallet();
  const [search, setSearch] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(15);

  const { onDeselectOneNft, onSelectOneNft, selectedNft } = useSelectLayout();

  const {
    currentVaultPubkey,
    isCloseSidebar,
    getPriceByMint,
    setIsCloseSidebar,
    rawNfts,
    setVisible,
    loading,
    searchItems,
  } = useBorrowPage(selectedNft);

  return (
    <SelectLayout
      currentVaultPubkey={currentVaultPubkey}
      selectedNfts={selectedNft}
      onDeselect={onDeselectOneNft}
      isCloseSidebar={isCloseSidebar}
      sidebarForm={
        <BorrowForm
          selectedNft={selectedNft}
          ltvPrice={getPriceByMint}
          onCloseSidebar={() => setIsCloseSidebar(true)}
        />
      }
    >
      <h1 className={styles.title}>Borrow money</h1>
      <h2 className={styles.subtitle}>
        Select your NFT to use as a collateral
      </h2>
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
          wrapperClassName={styles.nftsList}
          emptyMessage="No suitable NFTs found"
        >
          {rawNfts.map((nft) => (
            <NFTCheckbox
              key={nft.mint}
              onClick={() => onSelectOneNft(nft)}
              imageUrl={nft.metadata.image}
              name={nft.metadata.name}
              selected={
                !!selectedNft.find(
                  (selectedNft) => selectedNft?.mint === nft.mint,
                )
              }
              ltvPrice={nft.estimate[0].floorPrice}
            />
          ))}
        </FakeInfinityScroll>
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
