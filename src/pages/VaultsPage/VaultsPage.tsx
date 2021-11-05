import VaultCard, {
  MOCK_PROPS as VaultCardMockProps,
} from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import FakeInfinityScroll from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { useState } from 'react';

const allItems = Array(100).fill(VaultCardMockProps);

const VaultsPage = (): JSX.Element => {
  const [items, setItems] = useState(allItems);
  const searchItems = useDebounce((search: string) => {
    const searchUp = search.toUpperCase();
    setItems(allItems.filter((el) => el.name.toUpperCase().includes(searchUp)));
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
          items={items}
          component={VaultCard}
          wrapperClassName={styles.cards}
        />
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
