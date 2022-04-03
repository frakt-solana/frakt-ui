import { FC, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { Loader } from '../../../../components/Loader';
import VaultCard from '../../../../components/VaultCard';
import { PATHS } from '../../../../constants';
import styles from './styles.module.scss';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
  VaultData,
  VaultState,
} from '../../../../contexts/fraktion';

export const VaultsTab: FC = () => {
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { vaults, loading: vaultsLoading } = useFraktion();

  useFraktionInitialFetch();
  useFraktionPolling();

  const userVaults = useMemo(() => {
    return vaults
      .filter(
        (vault) =>
          vault.authority === walletPubkey &&
          vault.state !== VaultState.Inactive &&
          vault.state !== VaultState.Archived,
      )
      .sort(
        (vaultA: VaultData, vaultB: VaultData) => vaultB.state - vaultA.state,
      );
  }, [vaults, walletPubkey]);

  return (
    <>
      {vaultsLoading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <>
          <div className={styles.vaults}>
            {!userVaults.length && (
              <p className={styles.emptyMessage}>No vaults found</p>
            )}
            {userVaults.map((vault) => (
              <NavLink
                key={vault.vaultPubkey}
                to={`${PATHS.VAULT}/${vault.vaultPubkey}`}
              >
                <VaultCard vaultData={vault} />
              </NavLink>
            ))}
          </div>
        </>
      )}
    </>
  );
};
