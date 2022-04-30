import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { SearchInput } from '../../components/SearchInput';
import NFTCheckbox from '../../components/NFTCheckbox';
import { BorrowForm } from './components/BorrowForm';
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

  const { onDeselect, onSelect, selectedNfts } = useSelectLayout();

  const {
    isCloseSidebar,
    setIsCloseSidebar,
    setVisible,
    loading,
    nfts,
    searchItems,
  } = useBorrowPage();

  return (
    <SelectLayout
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      isCloseSidebar={isCloseSidebar}
      sidebarForm={
        <BorrowForm
          selectedNft={selectedNfts?.[0]}
          onCloseSidebar={() => setIsCloseSidebar(true)}
          ltvPrice={0.2}
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
          {nfts.map((nft) => (
            <NFTCheckbox
              key={nft.mint}
              onClick={() => onSelect(nft)}
              imageUrl={nft.metadata.image}
              name={nft.metadata.name}
              selected={
                !!selectedNfts.find(
                  (selectedNft) => selectedNft?.mint === nft.mint,
                )
              }
              ltv={0.2}
            />
          ))}
        </FakeInfinityScroll>
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
