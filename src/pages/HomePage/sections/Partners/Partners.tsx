import classNames from 'classnames/bind';
import styles from './styles.module.scss';
// import solana from './images/solana.svg';
import exchange from './images/exchange.svg';
import digitalEyes from './images/digitalEyes.svg';
import magicEden from './images/magicEden.svg';
// import metaplex from './images/metaplex.svg';
import radium from './images/radium.svg';
import serum from './images/serum.svg';
import solsea from './images/solsea.svg';

interface EcosystemProps {
  className?: string;
}

const Partners = ({ className }: EcosystemProps): JSX.Element => {
  return (
    <div className={classNames([styles.partners, className])}>
      <h2 className={styles.title}>Technical Partners</h2>
      <div className={styles.brands}>
        <a
          className={styles.img}
          href="https://raydium.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={radium} alt="Brand logo" />
        </a>
        <a
          className={styles.img}
          href="https://www.projectserum.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={serum} alt="Brand logo" />
        </a>
        <a
          className={styles.img}
          href="https://exchange.art/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={exchange} alt="Brand logo" />
        </a>
        <a
          className={styles.img}
          href="https://digitaleyes.market/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={digitalEyes} alt="Brand logo" />
        </a>
        <a
          className={styles.img}
          href="https://magiceden.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={magicEden} />
        </a>
        <a
          className={styles.img}
          href="https://solsea.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={solsea} alt="Brand logo" />
        </a>
      </div>
      {/* <h2 className={styles.title}>Backers</h2>
      <div className={classNames(styles.brands, styles.bottom)}>
        <a
          className={styles.img}
          href="https://www.metaplex.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={metaplex} alt="Brand logo" />
        </a>
        <a
          className={styles.img}
          href="https://solana.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={solana} alt="Brand logo" />
        </a>
      </div> */}
    </div>
  );
};

export default Partners;
