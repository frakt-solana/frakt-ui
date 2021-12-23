import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { DiscordIcon, TwitterIcon } from '../../icons';
import { CollectionData } from '../../utils/getCollectionsData/collections.model';
import VaultCard from '../../components/VaultCard';
import { useFraktion } from '../../contexts/fraktion';
import { mapVaultByCollectionName } from '../CollectionsPage/helpers';
import { URLS } from '../../constants';
import styles from './styles.module.scss';
import { getCollectionThumbnailUrl } from '../../utils';
import { useCollectionsItem } from '../../utils/getCollectionsData/collections.hooks';
import { WebsiteIcon } from '../../icons/WebsiteIcon';

const CollectionPage = (): JSX.Element => {
  const history = useHistory();
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

  const userVaults = useMemo(() => {
    return vaultsByCollectionName[queryId];
  }, [queryId, vaultsByCollectionName]);

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
