import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useConnection } from '@solana/wallet-adapter-react';

import styles from './styles.module.scss';
import Badge, { UnverifiedBadge, VerifiedBadge } from '../../components/Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { TwitterIcon2 } from '../../icons';

interface DetailsHeaderProps {
  vaultInfo: VaultInfo;
  tokerName?: string;
  className?: string;
}

interface VaultInfo {
  name: string;
  isNftVerified: boolean;
  state: string;
  authority: string;
}

export const DetailsHeader = ({
  className = '',
  vaultInfo,
  tokerName,
}: DetailsHeaderProps): JSX.Element => {
  const { connection } = useConnection();
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  useEffect(() => {
    vaultInfo?.authority &&
      getNameServiceInfo(vaultInfo?.authority, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo?.authority]);

  return (
    <div className={classNames(styles.detailsHeader, className)}>
      <h2 className={styles.title}>
        {vaultInfo.name} {tokerName ? `($${tokerName})` : ''}
      </h2>
      <div className={styles.statusAndOwner}>
        <div className={styles.status}>
          {vaultInfo.isNftVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
          <Badge label={vaultInfo.state} className={styles.badge} />
        </div>
        <div className={styles.owner}>
          <NavLink
            to={`/wallet/${vaultInfo.authority}`}
            className={styles.ownerLink}
          >
            <img
              className={styles.ownerAvatar}
              src={getOwnerAvatar(nameServiceInfo.twitterHandle)}
              alt="Owner avatar"
            />
            {nameServiceInfo.domain || shortenAddress(vaultInfo.authority)}
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
