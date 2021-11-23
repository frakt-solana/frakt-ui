import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

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
import { VaultState } from '../../contexts/fraktion';
import { useForm } from 'react-hook-form';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { ControlledSelect } from '../../components/Select/Select';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';

const SORT_VALUES = [
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'supply_asc',
  },
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'supply_desc',
  },
  {
    label: (
      <span>
        Buyout price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'buyoutPrice_asc',
  },
  {
    label: (
      <span>
        Buyout price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'buyoutPrice_desc',
  },
  {
    label: (
      <span>
        Fraction price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'lockedPricePerFraction_asc',
  },
  {
    label: (
      <span>
        Fraction price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'lockedPricePerFraction_desc',
  },
  {
    label: (
      <span>
        Date created <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'createdAt_asc',
  },
  {
    label: (
      <span>
        Date created <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'createdAt_desc',
  },
];

const VaultsPage = (): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      showActiveVaults: true,
      showBoughtVaults: false,
      showClosedVaults: false,
      showVerifiedVaults: true,
      showMyVaults: false,
      sort: SORT_VALUES[7],
    },
  });
  const showActiveVaults = watch('showActiveVaults');
  const showBoughtVaults = watch('showBoughtVaults');
  const showVerifiedVaults = watch('showVerifiedVaults');
  const showClosedVaults = watch('showClosedVaults');
  const showMyVaults = watch('showMyVaults');
  const sort = watch('sort');

  const { loading, vaults: rawVaults } = useFraktion();
  const { connected, publicKey } = useWallet();
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');
    //TODO optimise it 4n instead of n
    return rawVaults
      .filter(({ state, authority, name, isNftVerified }) => {
        if (connected && showMyVaults && authority !== publicKey.toString())
          return false;
        if (!showActiveVaults && state === VaultState[1]) return false;
        if (!showBoughtVaults && state === VaultState[2]) return false;
        if (!showClosedVaults && state === VaultState[3]) return false;
        if (showVerifiedVaults && !isNftVerified) return false;

        return name.toUpperCase().includes(searchString);
      })
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          if (sortOrder === 'asc') return a.createdAt - b.createdAt;
          return b.createdAt - a.createdAt;
        }
        if (sortOrder === 'asc') return a[sortField].cmp(b[sortField]);
        return b[sortField].cmp(a[sortField]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchString,
    rawVaults,
    showActiveVaults,
    showBoughtVaults,
    showClosedVaults,
    showVerifiedVaults,
    showMyVaults,
    sort,
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
        <div className={styles.filtersWrapper}>
          <div className={styles.filters}>
            <ControlledToggle
              control={control}
              name="showActiveVaults"
              label="Active"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showBoughtVaults"
              label="Bought"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showClosedVaults"
              label="Closed"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showVerifiedVaults"
              label="Verified"
              className={styles.filter}
            />
            {connected && (
              <ControlledToggle
                control={control}
                name="showMyVaults"
                label="My Vaults"
                className={styles.filter}
              />
            )}
          </div>
          <div>
            <ControlledSelect
              className={styles.sortingSelect}
              valueContainerClassName={styles.sortingSelectValueContainer}
              label="Sort by"
              control={control}
              name="sort"
              options={SORT_VALUES}
            />
          </div>
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
              fractionMint,
              publicKey,
              name,
              authority,
              state,
              imageSrc,
              supply,
              isNftVerified,
              lockedPricePerFraction,
              priceTokenMint,
              buyoutPrice,
            }) => (
              <NavLink key={publicKey} to={`${URLS.VAULT}/${publicKey}`}>
                <VaultCard
                  fractionMint={fractionMint}
                  name={name}
                  owner={authority}
                  vaultState={state}
                  imageSrc={imageSrc}
                  supply={supply}
                  isNftVerified={isNftVerified}
                  pricePerFraction={lockedPricePerFraction}
                  priceTokenMint={priceTokenMint}
                  buyoutPrice={buyoutPrice}
                />
              </NavLink>
            ),
          )}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
