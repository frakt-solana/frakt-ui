import { FC } from 'react';

import { TECHNICAL_PARTNERS_ID } from '../../constants';
import styles from './PartnersSection.module.scss';
import exchange from './images/exchange.svg';
import digitalEyes from './images/digitalEyes.svg';
import magicEden from './images/magicEden.svg';
import radium from './images/radium.svg';
import serum from './images/serum.svg';
import solsea from './images/solsea.svg';
import { Container } from '../../../../components/Layout';

interface PartnersSectionProps {
  navRef?: { current: HTMLParagraphElement };
}

const PartnersSection: FC<PartnersSectionProps> = ({ navRef }) => {
  return (
    <Container component="section" className={styles.root}>
      <h3 className={styles.title} ref={navRef} id={TECHNICAL_PARTNERS_ID}>
        Backers
      </h3>
      <div className={styles.brands}>
        {[radium, serum, exchange, digitalEyes, magicEden, solsea].map(
          (imageUrl, idx) => (
            <img key={idx} src={imageUrl} alt="Brand logo" />
          ),
        )}
      </div>
    </Container>
  );
};

export default PartnersSection;
