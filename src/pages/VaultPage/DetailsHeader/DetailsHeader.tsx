import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useConnection } from '@solana/wallet-adapter-react';

import styles from './styles.module.scss';
import Badge, {
  UnverifiedBadge,
  VAULT_BADGES_BY_STATE,
  VerifiedBadge,
} from '../../../components/Badge';
import { shortenAddress } from '../../../utils/solanaUtils';
import { getOwnerAvatar, useNameServiceInfo } from '../../../utils/nameService';
import { TwitterIcon2 } from '../../../icons';
import { VaultData } from '../../../contexts/fraktion';

interface DetailsHeaderProps {
  vaultData: VaultData;
  vaultTitleData?: {
    name: string;
    symbol: string;
  };
  className?: string;
}

export const DetailsHeader = ({
  className = '',
  vaultData,
  vaultTitleData,
}: DetailsHeaderProps): JSX.Element => {
  const { connection } = useConnection();
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  useEffect(() => {
    vaultData?.authority &&
      getNameServiceInfo(vaultData?.authority, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData?.authority]);

  return (
    <div className={classNames(styles.detailsHeader, className)}>
      <h2 className={styles.title}>
        {vaultTitleData?.name || `Vault #${vaultData.createdAt}`}{' '}
        {vaultTitleData.symbol && `($${vaultTitleData.symbol})`}
      </h2>
      <div className={styles.statusAndOwner}>
        <div className={styles.status}>
          {vaultData.isVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
          <Badge
            label={VAULT_BADGES_BY_STATE[vaultData.state]}
            className={styles.badge}
          />
        </div>
        <div className={styles.owner}>
          <NavLink
            to={`/wallet/${vaultData.authority}`}
            className={styles.ownerLink}
          >
            <div
              className={styles.ownerAvatar}
              style={{
                backgroundImage: `url(${getOwnerAvatar(
                  nameServiceInfo.twitterHandle,
                )})`,
              }}
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
