import { FC, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { LoadingModal } from '../../components/LoadingModal';
import { useWalletModal } from '../../contexts/WalletModal';
import { SearchInput } from '../../components/SearchInput';
import BorrowForm, { useBorrowForm } from './BorrowForm';
import NFTCheckbox from '../../components/NFTCheckbox';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { EstimateNFT, useLoans } from '../../contexts/loans';
import { UserNFT } from '../../contexts/userTokens';
import { useLazyTokens } from '../../contexts/userTokens/useLazyUserTokens';

interface UserNFTWithEstimate extends UserNFT {
  estimate: EstimateNFT[];
}

const BorrowPage: FC = () => {
  const wallet = useWallet();

  const [search, setSearch] = useState<string>('');
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);

  const { loadingModalVisible, closeLoadingModal } = useBorrowForm();
  const { itemsToShow, next } = useFakeInfinityScroll(15);
  const { setVisible } = useWalletModal();
  const { estimations } = useLoans();

  const { onDeselectOneNft, onSelectOneNft, searchItems, selectedNft } =
    useSelectLayout();

  const { nfts, fetchUserTokens, loading } = useLazyTokens();

  useEffect(() => {
    (async () => {
      await fetchUserTokens();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts, loading]);

  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();

  const rawNfts = nfts.reduce(
    (acc: UserNFTWithEstimate[], nft: UserNFT): UserNFTWithEstimate[] => {
      const nameNft = nft.metadata?.collection?.name;

      const filtered = estimations.filter(({ name }) => name === nameNft);
      if (filtered[0]?.id) {
        acc.push({ ...nft, estimate: filtered });
      }

      return acc;
    },
    [],
  );

  const getPriceByMint = useMemo(() => {
    if (rawNfts.length) {
      const selectedNftWithEstimation = rawNfts.filter(
        ({ mint }) => mint === selectedNft[0]?.mint,
      );
      return selectedNftWithEstimation[0]?.estimate[0]?.floorPrice;
    }
  }, [rawNfts, selectedNft]);

  return (
    <>
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
        {!wallet.connected ? (
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
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default BorrowPage;
