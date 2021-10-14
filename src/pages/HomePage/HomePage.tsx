import { Helmet } from 'react-helmet';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import HowItWorksSection from './sections/HowItWorks';
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
        <h2 className={styles.subtitle}>
          Fraktion is an open sourced protocol for NFT fractionalisation that
          allows custodial partial ownership of NFTs and helps NFT owners free
          up liquidity from their asset
        </h2>
        <h3 className={styles.launchingSoon}>Launching soon on Solana</h3>
        <div className={styles.separator} />
        {/* <KeyPointsSection /> */}
        <HowItWorksSection />
      </Container>
      <footer className={styles.footer}>Fraktion</footer>
    </AppLayout>
  );
};

export default HomePage;
