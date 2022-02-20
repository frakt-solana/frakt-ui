import { Helmet } from 'react-helmet';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import Statistics from './sections/Statistics/Statistics';
import {
  ArrowRightTop,
  DiscordIcon,
  FraktLogoIcon,
  TwitterIcon,
} from '../../icons';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { FullPotentialSection } from './sections/FullPotentialSection';
import { OurTokens } from './sections/OurTokens';
import { TeamSection } from './sections/TeamSection';
import { TestimonialsSection } from './sections/TestimonialsSection';

const HomePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Helmet>
        <title>FRAKTION ART</title>
      </Helmet>
      <main>
        <section className={styles.firstSectionBg}>
          <div className={`${styles.container} container`}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.mainTitle}> NFT x DeFi </h1>
              <div className={styles.subtitleWrapper}>
                <div className={styles.subtitleContent}>
                  <p className={styles.subtitle}>
                    Buy, sell, earn yield and get instant liquidity out of your
                    NFTs. Oh, and get rewarded in the process!
                  </p>
                  <div className={styles.subtitleNav}>
                    <NavLink to={PATHS.VAULTS} className={`common-accent-btn`}>
                      Try it out
                    </NavLink>
                    <a
                      href="https://docs.fraktion.art"
                      className={`${styles.docsLink} link-with-arrow`}
                    >
                      Read docs
                      <ArrowRightTop />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mainBg}>
              <FraktLogoIcon />
            </div>
          </div>
        </section>
        <Statistics />
        <FullPotentialSection />
        <OurTokens />
        <TestimonialsSection />
        <TeamSection />
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
