import styles from './styles.module.scss';

const HowItWorksSection = (): JSX.Element => {
  return (
    <div className={styles.howItWorks}>
      <h3 className={styles.howItWorksTitle}>How it works?</h3>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>DAO</h5>
          <p className={styles.cardText}>
            <a
              href="https://frakt.art/stake"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stake
            </a>{' '}
            your frakts and vote for key decisions an launchpad projects you
            want to see on{' '}
            <a
              href="https://launchpd.frakt.art/"
              target="_blank"
              rel="noopener noreferrer"
            >
              launchpad
            </a>
            .
          </p>
          <div className={styles.cardLinkContainer}>
            <a
              className={`${styles.cardLink} ${styles.cardLink_accent}`}
              href="https://frakt.art/stake"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stake Frakts
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Curation board</h5>
          <p className={styles.cardText}>
            We welcome digital artists and experts in field to participate in
            our art curation board to discover, attract and lead best artists in
            the world.
          </p>
          <div className={styles.cardLinkContainer}>
            <a
              className={styles.cardLink}
              href="https://t.me/tsamoylov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <h5 className={styles.cardTitle}>Curation board</h5>
          <p className={styles.cardText}>
            We welcome digital artists and experts in field to participate in
            our art curation board to discover, attract and lead best artists in
            the world.
          </p>
          <div className={styles.cardLinkContainer}>
            <a
              className={styles.cardLink}
              href="https://t.me/tsamoylov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
