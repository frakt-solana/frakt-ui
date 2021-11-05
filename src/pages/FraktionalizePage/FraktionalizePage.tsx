import { useState } from 'react';

import Button from '../../components/Button';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import NFTCheckbox from '../../components/NFTCheckbox';
import { SearchInput } from '../../components/SearchInput';
import { useUserTokens } from '../../contexts/userTokens';
import { UserToken } from '../../contexts/userTokens/userTokens.model';
import { useWallet } from '../../external/contexts/wallet';
import Sidebar from './Sidebar';
import styles from './styles.module.scss';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import FakeInfinityScroll from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';

const FraktionalizePage = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const { connected, select } = useWallet();
  const { fraktionalize } = useFraktion();
  const { tokens, loading } = useUserTokens();
  const [searchString, setSearchString] = useState<string>('');

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const [selectedToken, setSelectedToken] = useState<UserToken>(null);

  const clearSelectedToken = () => setSelectedToken(null);

  const onCardClick = (token: UserToken): void => {
    selectedToken?.mint === token.mint
      ? setSelectedToken(null)
      : setSelectedToken(token);
  };

  const onContinueClick = (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => {
    fraktionalize(tokenMint, pricePerFraction, fractionsAmount, 'SOL');
  };

  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        token={selectedToken}
        onRemoveClick={clearSelectedToken}
        onContinueClick={onContinueClick}
      />
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT</h4>
          <SearchInput
            value={search}
            size="large"
            onChange={(e) => {
              setSearch(e.target.value || '');
              searchItems(e.target.value || '');
            }}
            className={styles.search}
            placeholder="Search by curator, collection or asset"
          />
          {!connected ? (
            <Button
              type="secondary"
              className={styles.connectBtn}
              onClick={select}
            >
              Connect wallet
            </Button>
          ) : (
            <FakeInfinityScroll
              items={tokens
                .filter(({ metadata }) =>
                  metadata.name.toUpperCase().includes(searchString),
                )
                .map((token) => ({
                  onClick: () => onCardClick(token),
                  imageUrl: token.metadata.image,
                  name: token.metadata.name,
                  selected: selectedToken && selectedToken.mint === token.mint,
                }))}
              isLoading={loading}
              component={NFTCheckbox}
              wrapperClassName={styles.artsList}
              perPage={15}
              emptyMessage="Unfortunately, you don't have any NFTs available for fraktionalization"
            />
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
