import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Loader } from '../../../../components/Loader';
import VaultCard from '../../../../components/VaultCard';
import { PATHS } from '../../../../constants';
import styles from './styles.module.scss';
import { VaultData } from '../../../../contexts/fraktion';
import Toggle from '../../../../components/Toggle';

interface VaultsTabProps {
  vaults: VaultData[];
  unfinishedVaults: VaultData[];
  loading: boolean;
  isMyProfile?: boolean;
}

export const VaultsTab: FC<VaultsTabProps> = ({
  vaults,
  unfinishedVaults,
  loading,
  isMyProfile = false,
}) => {
  const [showUnfinished, setShowUnfinished] = useState<boolean>(false);

  const onToggleUnfinishedClick = () => {
    setShowUnfinished(!showUnfinished);
  };

  const noVaults = showUnfinished ? !unfinishedVaults.length : !vaults.length;

  const showToggle = isMyProfile && !!unfinishedVaults.length;

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <>
          <div className={styles.wrapper}>
            {showToggle && (
              <div className={styles.filters}>
                <Toggle
                  value={showUnfinished}
                  label="Show unfinished"
                  className={styles.filter}
                  onChange={onToggleUnfinishedClick}
                />
              </div>
            )}

            {noVaults && <p className={styles.emptyMessage}>No vaults found</p>}

            <div className={styles.vaults}>
              {(showUnfinished ? unfinishedVaults : vaults).map((vault) => (
                <NavLink
                  key={vault.vaultPubkey}
                  to={`${PATHS.VAULT}/${vault.vaultPubkey}`}
                >
                  <VaultCard vaultData={vault} />
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
