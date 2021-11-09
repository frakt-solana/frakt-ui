import { useState, useMemo } from 'react';

import VaultCard from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../constants';
import Toggle from '../../components/Toggle';
import classNames from 'classnames/bind';
import { VaultState } from '../../contexts/fraktion/fraktion.model';

const VaultsPage = (): JSX.Element => {
  const { loading, vaults: rawVaults } = useFraktion();
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const [filterActiveVaults, setFilterActiveVaults] = useState<boolean>(false);
  const [filterBoughtVaults, setFilterBoughtVaults] = useState<boolean>(false);
  const [filterClosedVaults, setFilterClosedVaults] = useState<boolean>(false);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    return rawVaults
      .filter(({ state }) => !(filterActiveVaults && state === VaultState[1]))
      .filter(({ state }) => !(filterBoughtVaults && state === VaultState[2]))
      .filter(({ state }) => !(filterClosedVaults && state === VaultState[3]))
      .filter(({ name }) => name.toUpperCase().includes(searchString));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchString,
    rawVaults,
    filterActiveVaults,
    filterBoughtVaults,
    filterClosedVaults,
  ]);
  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by vault name"
        />
        <div className={styles.filters}>
          <FilterToggle
            checked={!filterActiveVaults}
            toggleChecked={() => setFilterActiveVaults((prev) => !prev)}
            name="Active Vaults"
          />
          <FilterToggle
            checked={!filterBoughtVaults}
            toggleChecked={() => setFilterBoughtVaults((prev) => !prev)}
            name="Bought Vaults"
          />
          <FilterToggle
            checked={!filterClosedVaults}
            toggleChecked={() => setFilterClosedVaults((prev) => !prev)}
            name="Closed Vaults"
          />
        </div>

        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          wrapperClassName={styles.cards}
          emptyMessage={'No vaults found'}
        >
          {vaults.map(
            ({
              publicKey,
              name,
              authority,
              state,
              imageSrc,
              supply,
              isNftVerified,
              lockedPricePerFraction,
              priceTokenMint,
            }) => (
              <NavLink key={publicKey} to={`${URLS.VAULT}/${publicKey}`}>
                <VaultCard
                  name={name}
                  owner={authority}
                  vaultState={state}
                  imageSrc={imageSrc}
                  supply={supply}
                  isNftVerified={isNftVerified}
                  pricePerFraction={lockedPricePerFraction}
                  priceTokenMint={priceTokenMint}
                />
              </NavLink>
            ),
          )}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

const FilterToggle = ({
  checked,
  toggleChecked = () => {},
  name,
}: {
  checked?: boolean;
  toggleChecked?: () => void;
  name: string;
}): JSX.Element => {
  return (
    <div className={styles.filterToggle} onClick={toggleChecked}>
      <Toggle checked={!!checked} />
      <p
        className={classNames([
          styles.filterToggle__text,
          { [styles.filterToggle__text_muted]: !checked },
        ])}
      >
        {name}
      </p>
    </div>
  );
};

export default VaultsPage;
