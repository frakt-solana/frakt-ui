import BN from 'bn.js';
import { useState, useMemo, useEffect } from 'react';

import VaultCard from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { getArweaveMetadata } from '../../utils/getArweaveMetadata';
import { VaultState } from '../../contexts/fraktion/fraktion.model';

interface VaultCardType {
  vaultPubkey: string;
  name: string;
  ownerPubkey: string;
  image: string;
  state: string;
  supply: BN;
  pricePerFraction: BN;
}

const VaultsPage = (): JSX.Element => {
  const { loading, safetyBoxes, vaultsMap } = useFraktion();
  const [searchString, setSearchString] = useState<string>('');
  const [vaultsMetadataLoading, setVaultsMetadataLoading] =
    useState<boolean>(false);
  const [rawVaultCards, setRawVaultCards] = useState<VaultCardType[]>([]);
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  useEffect(() => {
    const fillRawVaultCards = async () => {
      setVaultsMetadataLoading(true);
      const arweaveMetadataArray = await getArweaveMetadata(
        safetyBoxes.map(({ tokenMint }) => tokenMint),
      );
      const metadataByToken = arweaveMetadataArray.reduce(
        (acc, { metadata, mint }) => {
          acc[mint] = metadata;
          return acc;
        },
        {},
      );

      const rawVaultCards = safetyBoxes.reduce(
        (acc, safetyBox): VaultCardType[] => {
          const arweaveMetadata = metadataByToken[safetyBox.tokenMint];
          const vault = vaultsMap[safetyBox.vault];

          if (arweaveMetadata && vault) {
            const { name, image } = arweaveMetadata;
            const {
              vaultPubkey,
              authority: ownerPubkey,
              state,
              lockedPricePerShare,
              fractionsSupply,
            } = vault;

            const vaultCard: VaultCardType = {
              vaultPubkey,
              name,
              image,
              ownerPubkey,
              state: VaultState[state],
              supply: fractionsSupply,
              pricePerFraction: lockedPricePerShare,
            };

            return [...acc, vaultCard];
          }
          return acc;
        },
        [],
      );

      setRawVaultCards(rawVaultCards);
      setVaultsMetadataLoading(false);
    };

    !loading && safetyBoxes.length && fillRawVaultCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, safetyBoxes]);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaultCards = useMemo(() => {
    return rawVaultCards.filter(({ name }) =>
      name.toUpperCase().includes(searchString),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, rawVaultCards]);

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by vault name"
        />
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading || vaultsMetadataLoading}
          wrapperClassName={styles.cards}
          emptyMessage={'No vaults found'}
        >
          {vaultCards.map(
            ({
              vaultPubkey,
              name,
              ownerPubkey,
              state,
              image,
              supply,
              pricePerFraction,
            }) => (
              <VaultCard
                key={vaultPubkey}
                name={name}
                owner={ownerPubkey}
                tags={[state]}
                imageSrc={image}
                supply={supply}
                pricePerFraction={pricePerFraction}
              />
            ),
          )}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
