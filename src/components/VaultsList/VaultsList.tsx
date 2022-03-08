import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { VaultData } from '../../contexts/fraktion';

import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../FakeInfinityScroll';
import VaultCard from '../VaultCard';
import styles from './VaultsList.module.scss';

interface VaultsListProps {
  vaults: VaultData[];
  isLoading?: boolean;
}

export const VaultsList: FC<VaultsListProps> = ({
  vaults,
  isLoading = true,
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  return (
    <>
      <div className={styles.wrapper}>
        <h2 className={styles.vaultsListTitle}>All vaults</h2>
        <span className={styles.vaultsAmount}>{vaults.length}</span>
      </div>
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={isLoading}
        wrapperClassName={styles.list}
        emptyMessage="No vaults found"
        loaderWrapperClassName={styles.loaderWrapper}
      >
        {vaults.map((vault) => (
          <NavLink
            key={vault.vaultPubkey}
            to={`${PATHS.VAULT}/${vault.vaultPubkey}`}
          >
            <VaultCard vaultData={vault} />
          </NavLink>
        ))}
      </FakeInfinityScroll>
    </>
  );
};
