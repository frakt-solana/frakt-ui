import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import ecosystem from './ecosystem.svg';
import Button from '../../../../components/Button';

interface FAQSectionProps {
  className?: string;
}

const Ecosystem = ({ className }: FAQSectionProps): JSX.Element => {
  return (
    <div className={classNames([styles.ecosystem, className])}>
      <h2>FRKT - Entrance to Ecosystem</h2>
      <div className={styles.description}>
        The $FRKT utility and governance token of the FRAKT ecosystem <br />
        had a fair launch on 10/10/2021
        <br />
        <br />
        The main purpose of the FRAKT token ($FRKT) is to incentivize as <br />
        many holders inlolved as possible in the governance of the protocol.
      </div>
      <h3>FRAKT ECOSYSTEM</h3>
      <div className={styles.imgWrapper}>
        <img src={ecosystem} />
      </div>
      <div className={styles.linkWrapper}>
        <a className={styles.link} href="#">
          Read Litepaper
        </a>
      </div>
      <div className={styles.btnWrapper}>
        <Button className={styles.btn} type="alternative">
          Buy FRKT
        </Button>
        <Button className={styles.btn} type="alternative">
          Stake FRKT
        </Button>
      </div>
    </div>
  );
};

export default Ecosystem;
