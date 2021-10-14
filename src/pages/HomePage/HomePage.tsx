import { Helmet } from 'react-helmet';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import KeyPointsSection from './sections';
import styles from './styles.module.scss';

const HomePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Helmet>
        <title>FRAKTION ART</title>
      </Helmet>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>
          BUY, SELL AND <b>FRAKTIONALIZE</b> NFTs
        </h1>
        <h2 className={styles.subtitle}>Launching soon on Solana</h2>
        <div className={styles.separator} />
        <KeyPointsSection />
      </Container>
      <footer className={styles.footer}>Fraktion</footer>
    </AppLayout>
  );
};

export default HomePage;
