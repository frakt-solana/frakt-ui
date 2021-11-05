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
  const [items, setItems] = useState([]);
  const { connected, select } = useWallet();
  const { fraktionalize } = useFraktion();
  const { tokens } = useUserTokens();

  const searchItems = useDebounce((search: string) => {
    const searchUp = search.toUpperCase();
    setItems(
      tokens.filter((el) => el.metadata.name.toUpperCase().includes(searchUp)),
    );
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
        <div className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT</h4>
          <SearchInput
            size="large"
            onChange={(e) => searchItems(e.target.value || '')}
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
              items={items.map((token) => ({
                onClick: () => onCardClick(token),
                imageUrl: token.metadata.image,
                name: token.metadata.name,
                selected: selectedToken && selectedToken.mint === token.mint,
              }))}
              component={NFTCheckbox}
              wrapperClassName={styles.artsList}
            />
          )}
        </div>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
