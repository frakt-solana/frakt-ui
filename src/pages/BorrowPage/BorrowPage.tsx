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
import { LinkWithArrow } from '../../components/LinkWithArrow';
import { getNftCreator, SOL_TOKEN } from '../../utils';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowPage: FC = () => {
  const { connected } = useWallet();
  const [search, setSearch] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(15);

  const { onDeselect, onSelect, selectedNfts } = useSelectLayout();

  const {
    isCloseSidebar,
    setVisible,
    loading,
    nfts,
    searchItems,
    loanData,
    priceByCreator,
    ltvByCreator,
    interestRateDiscountPercent,
  } = useBorrowPage();

  return (
    <SelectLayout
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      isCloseSidebar={isCloseSidebar}
      sidebarForm={
        <BorrowForm
          selectedNft={selectedNfts?.[0]}
          onDeselect={onDeselect}
          priceByCreator={priceByCreator}
          ltvByCreator={ltvByCreator}
          loanData={loanData}
          interestRateDiscountPercent={interestRateDiscountPercent}
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

      {!connected && (
        <Button
          type="secondary"
          className={styles.connectBtn}
          onClick={() => setVisible(true)}
        >
          Connect wallet
        </Button>
      )}

      {connected && !nfts?.length && !loading && (
        <div className={styles.noSuiableMessageWrapper}>
          <p className={styles.noSuiableMessage}>No suitable NFTs found</p>
          <LinkWithArrow
            className={styles.acceptedCollectionsLink}
            label="Check collections accepted for loans"
            to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
            externalLink
          />
        </div>
      )}

      {connected && (
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          wrapperClassName={styles.nftsList}
          emptyMessage=""
        >
          {nfts.map((nft) => {
            const creator = getNftCreator(nft);

            const loanValue =
              (priceByCreator[creator] * ltvByCreator[creator]) /
              10 ** SOL_TOKEN.decimals;

            return (
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
                loanValue={loanValue || null}
              />
            );
          })}
        </FakeInfinityScroll>
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
