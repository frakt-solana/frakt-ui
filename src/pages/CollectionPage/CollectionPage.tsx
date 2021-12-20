import React from 'react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { CollectionData } from '../../utils/getCollectionsData/collection.model';
import useCollectionsItem from '../../utils/getCollectionsData/useCollectionsItem';
import styles from './styles.module.scss';
import { useHistory } from 'react-router';
import { DiscordIcon, TwitterIcon } from '../../icons';
import { transResource } from '../../helpers/data-to-props';

const CollectionPage = (): JSX.Element => {
  const history = useHistory();
  const queryId = history.location.pathname.replace('/collection/', '');
  const { collectionsItem } = useCollectionsItem(queryId);

  const {
    bannerPath,
    collectionName,
    website,
    discord,
    twitter,
    thumbnailPath,
  } = collectionsItem as CollectionData;

  return (
    <AppLayout>
      <div className={styles.fullPage}>
        <img src={transResource(bannerPath)} />
      </div>
      <Container component="main" className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.thumbnail}>
            <img src={transResource(thumbnailPath)} />
          </div>
          <div className={styles.title}>{collectionName}</div>
          <div className={styles.socialLinks}>
            <a href={website}>
              <img src="" alt="website" />
            </a>
            <a href={discord}>
              <DiscordIcon width={48} />
            </a>
            <a href={twitter}>
              <TwitterIcon width={48} />
            </a>
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default CollectionPage;
