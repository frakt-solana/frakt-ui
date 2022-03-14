import { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './OurTokensSection.module.scss';
import { TokensBg } from '../../svg';
import { OUR_TOKENS_ID } from '../../constants';
import { Container } from '../../../../components/Layout';

interface OurTokensSectionProps {
  navRef?: { current: HTMLParagraphElement };
}

export const OurTokensSection: FC<OurTokensSectionProps> = ({ navRef }) => {
  return (
    <Container component="section" className={styles.root}>
      <h3 className={styles.title} id={OUR_TOKENS_ID} ref={navRef}>
        Our tokens
      </h3>
      <div className={styles.wrapper}>
        <div className={classNames(styles.card, styles.cardBlue)}>
          <h4 className={styles.titleCard}>$FRKX</h4>
          <div className={styles.infoWrapper}>
            <ul className={styles.infoList}>
            <li className={styles.infoItem}>Protocol utility token</li>
              <li className={styles.infoItem}>Reduced fees</li>
              <li className={styles.infoItem}>Trading, Borrowing and Referral rewards</li>
              <li className={styles.infoItem}>Deflationary via buybacks and burns</li>
            </ul>
          </div>
          <TokensBg className={styles.cardBg} fill={'#5D5FEF'} />
        </div>
        <div className={classNames(styles.card, styles.cardGreen)}>
          <h4 className={styles.titleCard}>$FRKT</h4>
          <div className={styles.infoWrapper}>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>Governance on DAO revenue</li>
              <li className={styles.infoItem}>Community activities</li>
              <li className={styles.infoItem}>Deflationary via recurring burn mechanisms</li>
              {/* <li className={styles.infoItem}>Reward token for FRKX stakers</li> */}
            </ul>
          </div>
          <TokensBg className={styles.cardBg} />
        </div>
      </div>
    </Container>
  );
};
