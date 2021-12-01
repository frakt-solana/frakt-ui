import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface WhyNeedsSectionProps {
  className?: string;
}

const WhyNeedsSection = ({ className }: WhyNeedsSectionProps): JSX.Element => {
  return (
    <div className={classNames([styles.whyNeeds, className])}>
      <h3 className={styles.title}>Why FRAKTIONALIZE?</h3>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Accessible</h5>
          <p className={styles.cardText}>
            Lower the barrier to entry for the NFT ecosystem.
          </p>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Flexible</h5>
          <p className={styles.cardText}>
            Do as you please with your FRAKTIONS&nbsp;— share, sell, buy!
          </p>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Community-driven</h5>
          <p className={styles.cardText}>Powered by FRAKT DAO.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyNeedsSection;
