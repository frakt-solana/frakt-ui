import VaultCard from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { useMemo } from 'react';
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

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <SearchInput
          size="large"
          className={styles.search}
          placeholder="Search by curator, collection or asset"
        />
        <div className={styles.cards}>
          {vaultCards.map((vaultCard) => {
            return (
              <VaultCard
                key={vaultCard.vaultPubkey}
                name={vaultCard.name}
                owner={vaultCard.ownerPubkey}
                tags={[vaultCard.state]}
                imageSrc={vaultCard.image}
              />
            );
          })}
        </div>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
