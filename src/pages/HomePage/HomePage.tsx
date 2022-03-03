import { FC, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import { AppLayout } from '../../components/Layout/AppLayout';
import Statistics from './sections/Statistics/Statistics';
import { ArrowRightTop, FraktLogoIcon } from '../../icons';
import { PATHS } from '../../constants';
import { FullPotentialSection } from './sections/FullPotentialSection';
import { OurTokensSection } from './sections/OurTokensSection';
import { TeamSection } from './sections/TeamSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import PartnersSection from './sections/PartnersSection';
import { Footer } from './sections/Footer';
import { CustomHeader } from './CustomHeader';
import { useIntersectionObserver } from '../../hooks';
import styles from './HomePage.module.scss';
import { Container } from '../../components/Layout';

const HomePage = (): JSX.Element => {
  const [activeLink, setActiveLink] = useState<string>('');

  const sectionRef1 = useRef<HTMLParagraphElement>();
  const sectionRef2 = useRef<HTMLParagraphElement>();
  const sectionRef3 = useRef<HTMLParagraphElement>();
  const sectionRef4 = useRef<HTMLParagraphElement>();
  const sectionRef5 = useRef<HTMLParagraphElement>();

  const menuLinksData = [
    { sectionRef: sectionRef1 },
    { sectionRef: sectionRef2 },
    { sectionRef: sectionRef3 },
    { sectionRef: sectionRef4 },
    { sectionRef: sectionRef5 },
  ];

  const intersectionCallback = (currentItemText: string) => {
    currentItemText !== activeLink && setActiveLink(currentItemText);
  };

  useIntersectionObserver(null, menuLinksData, intersectionCallback);

  const customHeaderWithLinks: FC = () => {
    return (
      <CustomHeader menuLinksData={menuLinksData} activeLink={activeLink} />
    );
  };

  return (
    <AppLayout CustomHeader={customHeaderWithLinks}>
      <Helmet>
        <title>FRAKTION ART</title>
      </Helmet>
      <main>
        <section className={styles.firstSectionBg}>
          <Container component="div" className={styles.container}>
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
              <FraktLogoIcon className={styles.mainImage} />
            </div>
          </Container>
        </section>
        <Statistics />
        <FullPotentialSection navRef={sectionRef1} />
        <OurTokensSection navRef={sectionRef2} />
        <TestimonialsSection />
        <PartnersSection navRef={sectionRef3} />
        <TeamSection navRef={sectionRef4} />
        <Footer navRef={sectionRef5} />
      </main>
    </AppLayout>
  );
};

export default HomePage;
