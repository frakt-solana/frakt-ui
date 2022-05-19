import { useMemo, useRef } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import Statistics from './sections/Statistics/Statistics';
import { FullPotentialSection } from './sections/FullPotentialSection';
import { OurTokensSection } from './sections/OurTokensSection';
import { TeamSection } from './sections/TeamSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
// import PartnersSection from './sections/PartnersSection';
import { Footer } from './sections/Footer';
import { CustomHeader } from './CustomHeader';
import { MainSection } from './sections/MainSection';
import { ProvideSection } from './sections/ProvideSection';

const HomePage = (): JSX.Element => {
  const sectionRef1 = useRef<HTMLParagraphElement>();
  const sectionRef2 = useRef<HTMLParagraphElement>();
  const sectionRef3 = useRef<HTMLParagraphElement>();
  const sectionRef4 = useRef<HTMLParagraphElement>();
  const sectionRef5 = useRef<HTMLParagraphElement>();
  const sectionRef6 = useRef<HTMLParagraphElement>();

  const menuLinksData = useMemo(() => {
    return [
      { sectionRef: sectionRef1 },
      { sectionRef: sectionRef2 },
      { sectionRef: sectionRef3 },
      { sectionRef: sectionRef4 },
      { sectionRef: sectionRef5 },
      { sectionRef: sectionRef6 },
    ];
  }, [
    sectionRef1,
    sectionRef2,
    sectionRef3,
    sectionRef4,
    sectionRef5,
    sectionRef6,
  ]);

  return (
    <AppLayout customHeader={<CustomHeader menuLinksData={menuLinksData} />}>
      <MainSection />
      <Statistics />
      <FullPotentialSection navRef={sectionRef1} />
      <ProvideSection navRef={sectionRef2} />
      <OurTokensSection navRef={sectionRef3} />
      <TestimonialsSection />
      {/* <PartnersSection navRef={sectionRef4} /> */}
      <TeamSection navRef={sectionRef5} />
      <Footer navRef={sectionRef6} />
    </AppLayout>
  );
};

export default HomePage;
