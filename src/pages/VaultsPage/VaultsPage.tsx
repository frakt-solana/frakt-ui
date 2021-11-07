import { useState, useMemo } from 'react';

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

const VaultsPage = (): JSX.Element => {
  const { loading, vaults: rawVaults } = useFraktion();
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    return rawVaults.filter(({ name }) =>
      name.toUpperCase().includes(searchString),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, rawVaults]);

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
          isLoading={loading}
          wrapperClassName={styles.cards}
          emptyMessage={'No vaults found'}
        >
          {vaults.map(
            ({
              publicKey,
              name,
              authority,
              state,
              imageSrc,
              supply,
              lockedPricePerFraction,
              priceTokenMint,
            }) => (
              <VaultCard
                key={publicKey}
                name={name}
                owner={authority}
                tags={[state]}
                imageSrc={imageSrc}
                supply={supply}
                pricePerFraction={lockedPricePerFraction}
                priceTokenMint={priceTokenMint}
              />
            ),
          )}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
