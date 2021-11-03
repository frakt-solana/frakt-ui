import VaultCard, {
  MOCK_PROPS as VaultCardMockProps,
} from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';

const VaultsPage = (): JSX.Element => {
  const cardsInfo = Array(100).fill(VaultCardMockProps);

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <SearchInput
          size="large"
          className={styles.search}
          placeholder="Search by curator, collection or asset"
        />
        <div className={styles.cards}>
          {cardsInfo.map((props, idx) => (
            <VaultCard key={idx} {...props} />
          ))}
        </div>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
