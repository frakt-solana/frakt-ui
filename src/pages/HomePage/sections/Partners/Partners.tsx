import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import solana from './images/solana.svg';
import exchange from './images/exchange.svg';
import digitalEyes from './images/digitalEyes.svg';
import magicEden from './images/magicEden.svg';
import metaplex from './images/metaplex.svg';
import radium from './images/radium.svg';
import serum from './images/serum.svg';
import solsea from './images/solsea.svg';

interface EcosystemProps {
  className?: string;
}

const Partners = ({ className }: EcosystemProps): JSX.Element => {
  return (
    <div className={classNames([styles.partners, className])}>
      <h2>Technical Partners</h2>
      <div className={styles.brandsWrapper}>
        <div className={styles.brands}>
          <div className={styles.img}>
            <img src={exchange} />
          </div>
          <div className={styles.img}>
            <img src={digitalEyes} />
          </div>
          <div className={styles.img}>
            <img src={magicEden} />
          </div>
        </div>
        <div className={styles.brands}>
          <div className={styles.img}>
            <img src={solsea} />
          </div>
          <div className={styles.img}>
            <img src={radium} />
          </div>
          <div className={styles.img}>
            <img src={serum} />
          </div>
        </div>
      </div>
      <h2>Backers</h2>
      <div className={styles.brandsWrapper}>
        <div className={classNames(styles.brands, styles.bottom)}>
          <div className={styles.img}>
            <img src={metaplex} />
          </div>
          <div className={styles.img}>
            <img src={solana} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
