import BN from 'bn.js';

import styles from './styles.module.scss';
import Badge, { VerifiedBadge, UnverifiedBadge } from '../Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { shortBigNumber } from '../../utils';
import fraktionConfig from '../../contexts/fraktion/config';
import { useTokenMap } from '../../contexts/TokenList';
import { useEffect, useState } from 'react';

export interface VaultCardProps {
  fractionMint: string;
  name: string;
  owner: string;
  vaultState: string;
  imageSrc: string;
  supply?: BN;
  isNftVerified?: boolean;
  pricePerFraction?: BN;
  priceTokenMint: string;
  buyoutPrice?: BN;
}

const VaultCard = ({
  fractionMint,
  name,
  owner,
  vaultState,
  imageSrc,
  supply = new BN(0),
  isNftVerified,
  pricePerFraction = new BN(0),
  priceTokenMint,
  buyoutPrice = new BN(0),
}: VaultCardProps): JSX.Element => {
  const tokenMap = useTokenMap();

  const [tokerName, setTokerName] = useState<string>('');
  const currency =
    priceTokenMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  useEffect(() => {
    setTokerName(tokenMap.get(fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${imageSrc})` }}
        >
          <div className={styles.actions}>
            {isNftVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
            <Badge label={vaultState} className={styles.badge} />
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {name} {tokerName ? `($${tokerName})` : ''}
          </div>
          <div className={styles.owner}>{shortenAddress(owner)}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Total supply</div>
            <div className={styles.value}>{shortBigNumber(supply, 1, 3)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Fraktion price ({currency})</div>
            <div className={styles.value}>
              {shortBigNumber(pricePerFraction, 6, 6)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Buyout price ({currency})</div>
            <div className={styles.value}>{shortBigNumber(buyoutPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
