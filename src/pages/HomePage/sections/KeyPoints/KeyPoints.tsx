import styles from './styles.module.scss';

const KeyPointsSection = (): JSX.Element => {
  return (
    <div className={styles.keyPoints}>
      <h3 className={styles.keyPointsTitle}>Key communication points</h3>
      <div className={styles.keyPointsContent}>
        <h4 className={styles.definitionsTitle}>Definitions</h4>
        <div className={styles.definitionsSeparator}></div>
        <ul className={styles.definitionsList}>
          <li>
            Fraktionalizer is an open sourced protocol for NFT fractionalisation
            on Solana.
          </li>
          <li>Fraktionalizer allows people to buy fractions of an NFT.</li>
          <li>
            It’s an open protocol that enables fractionalization of NFTs in
            tokens. This allows for custodial partial ownership of NFTs.
          </li>
          <li>
            Fraktionalizer helps NFT owners free up liquidity stuck in illiquid
            NFTs.
          </li>
          <li>
            Fraktionalizer helps people get exposure to blue chip projects.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KeyPointsSection;
