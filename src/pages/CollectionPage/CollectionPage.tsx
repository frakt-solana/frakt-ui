import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ArrowDownSmallIcon, DiscordIcon, TwitterIcon } from '../../icons';
import { CollectionData } from '../../utils/getCollectionsData/collections.model';
import VaultCard from '../../components/VaultCard';
import { useFraktion } from '../../contexts/fraktion';
import { mapVaultByCollectionName } from '../CollectionsPage/helpers';
import { URLS } from '../../constants';
import styles from './styles.module.scss';
import { getCollectionThumbnailUrl } from '../../utils';
import { useCollectionsItem } from '../../utils/getCollectionsData/collections.hooks';
import { WebsiteIcon } from '../../icons/WebsiteIcon';
import { useDebounce } from '../../hooks';
import { SearchInput } from '../../components/SearchInput';
import { ControlledSelect } from '../../components/Select/Select';

const SORT_VALUES = [
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
];

const CollectionPage: FC = () => {
  const { control } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  const history = useHistory();
  const [searchString, setSearchString] = useState<string>('');
  const queryId = history.location.pathname.replace('/collection/', '');
  const { collectionsItem } = useCollectionsItem(queryId);
  const { vaults, loading } = useFraktion();

  const {
    bannerPath,
    collectionName,
    website,
    discord,
    twitter,
    thumbnailPath,
  } = collectionsItem as CollectionData;

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultByCollectionName(vaults);
  }, [loading, vaults]);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const userVaults = useMemo(() => {
    const filteredVaults = vaultsByCollectionName[queryId];

    if (filteredVaults) {
      return filteredVaults.filter(({ safetyBoxes }) => {
        const { nftCollectionName } = safetyBoxes[0];
        return nftCollectionName.toUpperCase().includes(searchString);
      });
    }
  }, [queryId, vaultsByCollectionName, searchString]);

  return (
    <AppLayout>
      <div className={styles.fullPage}>
        <img src={getCollectionThumbnailUrl(bannerPath)} />
      </div>

      <Container component="main" className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.thumbnail}>
            <img src={getCollectionThumbnailUrl(thumbnailPath)} />
          </div>
          <div className={styles.title}>{collectionName}</div>
          <div className={styles.socialLinks}>
            <a href={website} target="_bank" rel="noopener noreferrer">
              <WebsiteIcon width={46} alt="website" />
            </a>
            <a href={discord} target="_bank" rel="noopener noreferrer">
              <DiscordIcon width={48} alt="discord" />
            </a>
            <a href={twitter} target="_bank" rel="noopener noreferrer">
              <TwitterIcon width={48} alt="twitter" />
            </a>
          </div>
        </div>
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by vault name"
        />
        <div className={styles.filtersWrapper}>
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

        {userVaults && (
          <div className={styles.cards}>
            {userVaults.map((vault) => (
              <NavLink
                key={vault.vaultPubkey}
                to={`${URLS.VAULT}/${vault.vaultPubkey}`}
              >
                <VaultCard vaultData={vault} />
              </NavLink>
            ))}
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default CollectionPage;
