import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';

const FraktionalizePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <p>Fraktionalize page</p>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
