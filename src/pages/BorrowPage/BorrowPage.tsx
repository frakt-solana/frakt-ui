import { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { useWalletModal } from '../../contexts/WalletModal';
import { SearchInput } from '../../components/SearchInput';
import NFTCheckbox from '../../components/NFTCheckbox';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import Button from '../../components/Button';
import styles from './BorrowPage.module.scss';
import BorrowForm from './BorrowForm';
import { PublicKey } from '@solana/web3.js';
import LoansService from '../../services/LoansService';

const BorrowPage: FC = () => {
  const [search, setSearch] = useState('');

  const wallet = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  const fetchBalance = async () => {
    const response = await LoansService.getNftEstimation();
    console.log(response);
  };

  const onLogin = async () => {
    await LoansService.login({ wallet });
  };

  const getTokenaccount = async () => {
    const response = await LoansService.go({
      wallet,
      connection,
      nft: new PublicKey('9N2Yxzotmqg3ufbsJHGTNy394X1vsZRiQx7GdtELyCBr'),
    });
    console.log(response);
  };

  const {
    onDeselectOneNft,
    onSelectOneNft,
    nfts,
    searchItems,
    loading,
    activeTokenAddress,
    selectedNft,
  } = useSelectLayout();
  const { itemsToShow, next } = useFakeInfinityScroll(15);

  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();

  return (
    <SelectLayout
      currentVaultPubkey={currentVaultPubkey}
      selectedNfts={selectedNft}
      onDeselect={onDeselectOneNft}
      sidebarForm={<BorrowForm selectedNft={selectedNft} />}
    >
      <Button onClick={getTokenaccount}>click</Button>
      <Button onClick={onLogin}>Login</Button>
      <Button onClick={fetchBalance}>Fetch</Button>
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
          {nfts.map((nft) => (
            <NFTCheckbox
              key={nft.mint}
              onClick={() => onSelectOneNft(nft)}
              imageUrl={nft.metadata.image}
              name={nft.metadata.name}
              selected={activeTokenAddress === nft.mint}
              ltvPrice={'30'}
            />
          ))}
        </FakeInfinityScroll>
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
