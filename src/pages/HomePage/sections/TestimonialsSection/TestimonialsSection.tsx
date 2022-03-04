import { FC } from 'react';

import styles from './TestimonialsSection.module.scss';
import { Slider } from './Slider';
import { Container } from '../../../../components/Layout';

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
            they&apos;re here to stay.
          </p>
          <p className={styles.textParagraph}>
            FRAKT&apos;s vision is to supercharge the use cases built around
            NFTs by making them more liquid.
          </p>
          <p className={styles.textParagraph}>
            With liquid NFTs, there are no limits to what&apos;s possible: yield
            generation, community empowerment, instant trading & swapping of
            NFTs, collaterized lending... your imagination is the limit!
          </p>
        </div>
      </div>
      <Slider />
    </Container>
  );
};
