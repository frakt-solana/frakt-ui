import BN from 'bn.js';

import styles from './styles.module.scss';
import DoneIcon from '../../icons/DoneIcon';
import Badge from '../Badge';
import { shortenAddress } from '../../external/utils/utils';
import { decimalBNToString } from '../../utils';

export interface VaultCardProps {
  name: string;
  owner: string;
  tags: string[];
  imageSrc: string;
  supply?: BN;
  pricePerFraction?: BN;
}

const VaultCard = ({
  name,
  owner,
  tags,
  imageSrc,
  supply = new BN(0),
  pricePerFraction = new BN(0),
}: VaultCardProps): JSX.Element => (
  <div className={styles.cardContainer}>
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className={styles.actions}>
          <DoneIcon />
          {tags.map((tag, idx) => (
            <Badge key={idx} label={tag} className={styles.badge} />
          ))}
        </div>
      </div>
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.owner}>{shortenAddress(owner)}</div>
      </div>
      <div className={styles.stats}>
        <div className={styles.item}>
          <div className={styles.title}>Total supply</div>
          <div className={styles.value}>{supply.toString().slice(0, -3)}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>Fraction price</div>
          <div className={styles.value}>
            {decimalBNToString(pricePerFraction, 3, 8)}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>Buyout price</div>
          <div className={styles.value}>
            {decimalBNToString(pricePerFraction.mul(supply), 2, 11)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VaultCard;
