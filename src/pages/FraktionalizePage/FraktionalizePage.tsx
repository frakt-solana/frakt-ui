import { useState } from 'react';
import Button from '../../components/Button';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import NFTCheckbox from '../../components/NFTCheckbox';
import { SearchInput } from '../../components/SearchInput';
import { useUserTokens } from '../../contexts/userTokens';
import { UserToken } from '../../contexts/userTokens/userTokens.model';
import { useWallet } from '../../external/contexts/wallet';
import styles from './styles.module.scss';

const FraktionalizePage = (): JSX.Element => {
  const { connected, select } = useWallet();
  const { tokens } = useUserTokens();

  const [selectedToken, setSelectedToken] = useState<UserToken>(null);

  const onCardClick = (token: UserToken): void => {
    selectedToken?.mint === token.mint
      ? setSelectedToken(null)
      : setSelectedToken(token);
  };

  return (
    <AppLayout className={styles.positionRelative}>
      <div className={styles.sidebar}>I am sidebar</div>
      <Container component="main" className={styles.contentWrapper}>
        <div className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT</h4>
          <SearchInput
            size="large"
            className={styles.search}
            placeholder="Search by curator, collection or asset"
          />
          {!connected && (
            <Button
              type="secondary"
              className={styles.connectBtn}
              onClick={select}
            >
              Connect wallet
            </Button>
          )}
          <div className={styles.artsList}>
            {tokens.map((token, idx) => (
              <NFTCheckbox
                key={idx}
                onClick={() => onCardClick(token)}
                imageUrl={token.metadata.image}
                name={token.metadata.name}
                selected={selectedToken && selectedToken.mint === token.mint}
              />
            ))}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
