import classNames from 'classnames/bind';
import styles from './styles.module.scss';
// import ecosystem from './ecosystem.svg';
import ecosystem_new from './FRAKT ECOSYSTEM TALL_compressed.png';
import Button from '../../../../components/Button';

interface EcosystemProps {
  className?: string;
}

const Ecosystem = ({ className }: EcosystemProps): JSX.Element => {
  return (
    <div className={classNames([styles.ecosystem, className])}>
      <h2>FRKT - Entrance to Ecosystem</h2>
      <div className={styles.description}>
        The utility and governance token of the FRAKT ecosystem ($FRKT)
        <br />
        had a fair launch on 10/10/2021.
        <br />
        <br />
        The main purpose of $FRKT is to incentivize and
        <br />
        involve as many holders as possible in the governance of the protocol.
      </div>
      {/* <h3>FRAKT ECOSYSTEM</h3> */}
      <div className={styles.imgWrapper}>
        <img src={ecosystem_new} />
      </div>
      <div className={styles.linkWrapper}>
        <a
          className={styles.link}
          href="https://medium.com/@frakt_nft/frakt-litepaper-5c87236fb1d1"
          target="_blank"
          rel="nopener noreferrer"
        >
          Read Litepaper
        </a>
      </div>
      <div className={styles.btnWrapper}>
        <a
          href={`https://raydium.io/swap/?from=11111111111111111111111111111111&to=ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/`}
          target="_blank"
          rel="nopener noreferrer"
        >
          <Button type="alternative">Buy FRKT</Button>
        </a>
        <a
          href="https://frakt.art/stake"
          target="_blank"
          rel="nopener noreferrer"
        >
          <Button type="alternative">Stake FRKT</Button>
        </a>
      </div>
    </div>
  );
};

export default Ecosystem;
