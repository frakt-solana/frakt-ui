import { Helmet } from 'react-helmet';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import WhyNeedsSection from './sections/WhyNeedsSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FAQSection from './sections/FAQSection';
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
        <div className={styles.separatorDouble} />
        <WhyNeedsSection className={styles.whyNeeds} />
        <div className={styles.separator} />
        <HowItWorksSection className={styles.howItWorks} />
        <div className={styles.separator} />
        <FAQSection />
      </Container>
      <footer className={styles.footer}>Fraktion</footer>
    </AppLayout>
  );
};

export default HomePage;
