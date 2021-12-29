import { FC } from 'react';
import { DiscordIcon, TwitterIcon2 as TwitterIcon } from '../../../icons';
import { WebsiteIcon } from '../../../icons/WebsiteIcon';
import { getCollectionThumbnailUrl } from '../../../utils';
import { useCollectionData } from '../../../utils/collections';

import styles from './styles.module.scss';

interface CollectionBannerProps {
  collectionName: string;
}

export const CollectionBanner: FC<CollectionBannerProps> = ({
  collectionName,
}) => {
  const { collectionsItem: collectionData } = useCollectionData(collectionName);

  return (
    <div className={styles.banner}>
      <div
        className={styles.bgImage}
        style={{
          backgroundImage: `url(${getCollectionThumbnailUrl(
            collectionData?.bannerPath,
          )})`,
        }}
      />
      <img
        className={styles.thumbnail}
        src={getCollectionThumbnailUrl(collectionData?.thumbnailPath)}
      />
      <div className={styles.title}>{collectionData?.collectionName}</div>
      <div className={styles.socialLinks}>
        {collectionData?.website && (
          <a
            href={collectionData.website}
            target="_bank"
            rel="noopener noreferrer"
          >
            <WebsiteIcon width={46} alt="website" />
          </a>
        )}
        {collectionData?.discord && (
          <a
            href={collectionData.discord}
            target="_bank"
            rel="noopener noreferrer"
          >
            <DiscordIcon width={48} alt="discord" />
          </a>
        )}
        {collectionData?.twitter && (
          <a
            href={collectionData.twitter}
            target="_bank"
            rel="noopener noreferrer"
          >
            <TwitterIcon width={48} alt="twitter" />
          </a>
        )}
      </div>
    </div>
  );
};
