import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import Badge, { VerifiedBadge, UnverifiedBadge } from '../Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { shortBigNumber } from '../../utils';
import fraktionConfig from '../../contexts/fraktion/config';
import { useTokenMap } from '../../contexts/TokenList';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { VaultData, VaultState } from '../../contexts/fraktion';
import styles from './styles.module.scss';

export interface VaultCardProps {
  vaultData: VaultData;
}

const VaultCard = ({ vaultData }: VaultCardProps): JSX.Element => {
  const tokenMap = useTokenMap();
  const { connection } = useConnection();
  const [tokerName, setTokerName] = useState<string>('');
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const currency =
    vaultData.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  useEffect(() => {
    setTokerName(tokenMap.get(vaultData.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap]);

  useEffect(() => {
    vaultData.authority && getNameServiceInfo(vaultData.authority, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData.authority]);

  //TODO: finish for baskets
  const { nftName, nftImage, isNftVerified } =
    vaultData.safetyBoxes.length === 1
      ? vaultData.safetyBoxes[0]
      : {
          nftName: '',
          nftImage: '',
          isNftVerified: false,
        };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${nftImage})` }}
        >
          <div className={styles.actions}>
            {isNftVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
            {/* //TODO: Fix bages */}
            {vaultData.state === VaultState.AuctionStarted ? (
              <>
                <Badge label="Auction" className={styles.badge} />
                <Badge label="Live" className={styles.badge} />
              </>
            ) : (
              <Badge
                label={VaultState[vaultData.state]}
                className={styles.badge}
              />
            )}
            {vaultData.hasMarket && (
              <Badge label="Tradable" className={styles.badge} />
            )}
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {nftName} {tokerName ? `($${tokerName})` : ''}
          </div>
          <div className={styles.owner}>
            <img
              className={styles.owner__avatar}
              src={getOwnerAvatar(nameServiceInfo.twitterHandle)}
              alt="Owner avatar"
            />
            {nameServiceInfo.domain || shortenAddress(vaultData.authority)}
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Total supply</div>
            <div className={styles.value}>
              {shortBigNumber(vaultData.fractionsSupply, 1, 3)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Fraktion price ({currency})</div>
            <div className={styles.value}>
              {shortBigNumber(vaultData.lockedPricePerShare, 6, 6)}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Buyout price ({currency})</div>
            <div className={styles.value}>
              {shortBigNumber(
                vaultData.lockedPricePerShare.mul(vaultData.fractionsSupply),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
