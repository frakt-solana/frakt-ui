import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useConnection } from '@solana/wallet-adapter-react';

import styles from './styles.module.scss';
import Badge, { UnverifiedBadge, VerifiedBadge } from '../../components/Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { TwitterIcon2 } from '../../icons';
import { VaultData, VaultState } from '../../contexts/fraktion';

interface DetailsHeaderProps {
  vaultData: VaultData;
  tokerName?: string;
  className?: string;
}

export const DetailsHeader = ({
  className = '',
  vaultData,
  tokerName,
}: DetailsHeaderProps): JSX.Element => {
  const { connection } = useConnection();
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  useEffect(() => {
    vaultData?.authority &&
      getNameServiceInfo(vaultData?.authority, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData?.authority]);

  //TODO: Finish for baskets
  const { nftName, isNftVerified } =
    vaultData.safetyBoxes.length === 1
      ? vaultData.safetyBoxes[0]
      : {
          nftName: '',
          isNftVerified: false,
        };

  return (
    <div className={classNames(styles.detailsHeader, className)}>
      <h2 className={styles.title}>
        {nftName} {tokerName ? `($${tokerName})` : ''}
      </h2>
      <div className={styles.statusAndOwner}>
        <div className={styles.status}>
          {isNftVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
          <Badge label={VaultState[vaultData.state]} className={styles.badge} />
        </div>
        <div className={styles.owner}>
          <NavLink
            to={`/wallet/${vaultData.authority}`}
            className={styles.ownerLink}
          >
            <img
              className={styles.ownerAvatar}
              src={getOwnerAvatar(nameServiceInfo.twitterHandle)}
              alt="Owner avatar"
            />
            {nameServiceInfo.domain || shortenAddress(vaultData.authority)}
          </NavLink>
          {nameServiceInfo.twitterHandle && (
            <a
              className={styles.ownerTwitter}
              href={`https://twitter.com/${nameServiceInfo.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon2 width={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
