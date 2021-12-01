import { Helmet } from 'react-helmet';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import WhyNeedsSection from './sections/WhyNeedsSection';
import ProcessSection from './sections/ProcessSection';
import FAQSection from './sections/FAQSection';
import styles from './styles.module.scss';
import Statistics from './sections/Statistics/Statistics';
import Ecosystem from './sections/Ecosystem';
import Partners from './sections/Partners';
import { DiscordIcon, TwitterIcon } from '../../icons';
import Roadmap from './sections/Roadmap';
import classNames from 'classnames/bind';

const HomePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Helmet>
        <title>FRAKTION ART</title>
      </Helmet>
      <main>
        <Container
          component="div"
          className={classNames(styles.container, styles.container_up)}
        >
          <h1 className={styles.title}>
            Unlocking liquidity
            <br />
            one <b>fraktion</b> at time
          </h1>
          <h2 className={styles.subtitle}>
            Create, buy and sell <b>fraktions</b> of NFTs
          </h2>
          <a
            href="https://docs.fraktion.art"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.launchingSoon}
          >
            Read docs
          </a>
          {/* <div className={styles.separatorDouble} /> */}
        </Container>
        <Statistics />
        <Container component="div" className={styles.container}>
          <WhyNeedsSection className={styles.whyNeeds} />
          <div className={styles.separator} />
          <ProcessSection className={styles.howItWorks} />
          <div className={styles.separator} />
          <Ecosystem />
          <div className={styles.separator} />
          <Roadmap />
          <div className={styles.separator} />
          <Partners />
          <div className={styles.separator} />
          <FAQSection />
        </Container>
      </main>
      <footer className={styles.footer}>
        <p>Fraktion</p>
        <div className={styles.socialLinks}>
          <a
            href="https://twitter.com/fraktion_art"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon width={32} />
          </a>
          <a
            href="https://discord.gg/frakt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon width={32} />
          </a>
        </div>
      </footer>
    </AppLayout>
  );
};

export default HomePage;
