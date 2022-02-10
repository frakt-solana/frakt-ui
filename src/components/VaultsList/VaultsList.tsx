import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../constants';
import { VaultData } from '../../contexts/fraktion';

import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../FakeInfinityScroll';
import VaultCard from '../VaultCard';
import styles from './styles.module.scss';

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
    <FakeInfinityScroll
      itemsToShow={itemsToShow}
      next={next}
      isLoading={isLoading}
      wrapperClassName={styles.list}
      emptyMessage="No vaults found"
    >
      {vaults.map((vault) => (
        <NavLink
          key={vault.vaultPubkey}
          className={styles.item}
          to={`${URLS.VAULT}/${vault.vaultPubkey}`}
        >
          <VaultCard vaultData={vault} />
        </NavLink>
      ))}
    </FakeInfinityScroll>
  );
};
