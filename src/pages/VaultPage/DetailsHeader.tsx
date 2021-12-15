import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Badge, { UnverifiedBadge, VerifiedBadge } from '../../components/Badge';
import { shortenAddress } from '../../utils/solanaUtils';

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
          {shortenAddress(vaultInfo.authority)}
        </div>
      </div>
    </div>
  );
};
