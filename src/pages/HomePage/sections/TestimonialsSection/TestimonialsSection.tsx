import { FC } from 'react';

import styles from './TestimonialsSection.module.scss';
import { Container } from '../../../../components/Layout';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';

export const TestimonialsSection: FC = () => {
  return (
    <Container component="section" className={styles.container}>
      <div className={styles.infoWrapper}>
        <h2 className={styles.title}>
          NFTs are at the centre of the value creation in the digital revolution
        </h2>
        <div className={styles.infoText}>
          <p className={styles.textParagraph}>
            NFTs have taken the world by surprise and one thing is for sure —
            they&apos;re here to stay. FRAKT&apos;s vision is to bootstrap
            infrastructure around NFTs by making them more liquid and bring NFT
            users full access to DeFi products just like with fungible tokens.
          </p>

          <p className={styles.textParagraph}>
            <LinkWithArrow
              externalLink
              to="https://tinyurl.com/zp3rx6z3"
              label="Join our Discord to get more involved, find alpha and benefit the most!"
              className={styles.docsLink}
            />
          </p>

          {/* <p className={styles.textParagraph}>
            With liquid NFTs, there are no limits to what&apos;s possible: yield
            generation, community empowerment, instant trading & swapping of
            NFTs, collaterized lending... your imagination is the limit!
          </p> */}
        </div>
      </div>
      {/* <Slider /> */}
    </Container>
  );
};
