import { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { LinkWithArrow } from '../../components/LinkWithArrow';
import { SearchInput } from '../../components/SearchInput';
import NFTCheckbox from '../../components/NFTCheckbox';
import { BorrowForm } from './components/BorrowForm';
import FakeInfinityScroll, {
  useInfinityScroll,
} from '../../components/FakeInfinityScroll';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { useBorrowPage } from './hooks';
import { commonActions } from '../../state/common/actions';
import { FetchData } from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserWhitelistedNFT } from '../../contexts/userTokens';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowPage: FC = () => {
  const dispatch = useDispatch();
  // const [search, setSearch] = useState<string>('');
  const { connected, onDeselect, onSelect, selectedNfts } = useSelectLayout();

  const { isCloseSidebar, fetchData, loading, searchItems, nfts } =
    useBorrowPage();

  const fetchData1: FetchData = async ({ offset, limit, searchStr }) => {
    const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;

    const items = await (
      await fetch(
        `${URL}/Gu6faGp621MczGbkVtTppFNjJaoBSGQTM51NsQdJXLyR?${
          searchStr && `search=${searchStr}&`
        }skip=${offset}&limit=${limit}`,
      )
    ).json();

    return items || [];
  };

  const { next, search, setSearch, items } = useInfinityScroll({
    fetchData: fetchData1,
    itemsPerScroll: 12,
  });

  return (
    <SelectLayout
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      isCloseSidebar={isCloseSidebar}
      sidebarForm={
        <BorrowForm selectedNft={selectedNfts?.[0]} onDeselect={onDeselect} />
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
          onClick={() =>
            dispatch(commonActions.setWalletModal({ isVisible: true }))
          }
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
          itemsToShow={undefined}
          next={next}
          isLoading={false}
          wrapperClassName={styles.nftsList}
          emptyMessage=""
          customLoader={<p className={styles.loader}>loading your jpegs</p>}
        >
          {(items as UserWhitelistedNFT[]).map((nft) => {
            return (
              <NFTCheckbox
                key={nft.mint}
                onClick={() => onSelect(nft)}
                imageUrl={nft.imageUrl}
                name={nft.name}
                selected={
                  !!selectedNfts.find(
                    (selectedNft) => selectedNft?.mint === nft.mint,
                  )
                }
                loanValue={Number(nft.loanValue)}
              />
            );
          })}
        </FakeInfinityScroll>
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
