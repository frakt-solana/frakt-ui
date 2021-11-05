import VaultCard from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import FakeInfinityScroll from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { useState, useMemo, useEffect } from 'react';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { getNFTArweaveMetadataByMint } from '../../utils';
import { VaultState } from '../../contexts/fraktion/fraktion.model';

interface VaultCardType {
  vaultPubkey: string;
  name: string;
  ownerPubkey: string;
  image: string;
  state: string;
}

const VaultsPage = (): JSX.Element => {
  const { loading, safetyBoxes, vaultsMap } = useFraktion();
  const [items, setItems] = useState<VaultCardType[]>([]);

  const vaultCards: VaultCardType[] = useMemo(() => {
    return safetyBoxes.reduce((acc, safetyBox): VaultCardType[] => {
      const arweaveMetadata = getNFTArweaveMetadataByMint(safetyBox.tokenMint);
      const vault = vaultsMap[safetyBox.vault];

      if (arweaveMetadata && vault) {
        const { name, image } = arweaveMetadata;
        const { vaultPubkey, authority: ownerPubkey, state } = vault;

        const vaultCard: VaultCardType = {
          vaultPubkey,
          name,
          image,
          ownerPubkey,
          state: VaultState[state],
        };

        return [...acc, vaultCard];
      }

      return acc;
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setItems(vaultCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, vaultCards);

  const searchItems = useDebounce((search: string) => {
    const searchUp = search.toUpperCase();
    setItems(
      vaultCards.filter((el) => el.name.toUpperCase().includes(searchUp)),
    );
  }, 300);

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by curator, collection or asset"
        />
        <FakeInfinityScroll
          items={items.map((vaultCard) => ({
            name: vaultCard.name,
            owner: vaultCard.ownerPubkey,
            tags: [vaultCard.state],
            imageSrc: vaultCard.image,
          }))}
          isLoading={loading}
          component={VaultCard}
          wrapperClassName={styles.cards}
        />
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
