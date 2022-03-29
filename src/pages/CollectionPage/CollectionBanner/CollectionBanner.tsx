import { FC } from 'react';
import { DiscordIcon, TwitterIcon2 as TwitterIcon } from '../../../icons';
import { WebsiteIcon } from '../../../icons/WebsiteIcon';
import { CollectionData } from '../../../utils/collections';

import styles from './styles.module.scss';

interface CollectionBannerProps {
  currentCollection: CollectionData[];
}

export const CollectionBanner: FC<CollectionBannerProps> = ({
  currentCollection,
}) => {
  return (
    <div className={styles.banner}>
      <div
        className={styles.bgImage}
        style={{
          backgroundImage: `url(${currentCollection[0]?.image})`,
        }}
      />
      <img className={styles.thumbnail} src={currentCollection[0]?.image} />
      <div className={styles.title}>{currentCollection[0]?.name}</div>
      <div className={styles.socialLinks}>
        {currentCollection[0]?.website && (
          <a
            href={currentCollection[0].website}
            target="_bank"
            rel="noopener noreferrer"
          >
            <WebsiteIcon width={46} alt="website" />
          </a>
        )}
        {currentCollection[0]?.discord && (
          <a
            href={currentCollection[0].discord}
            target="_bank"
            rel="noopener noreferrer"
          >
            <DiscordIcon width={48} alt="discord" />
          </a>
        )}
        {currentCollection[0]?.twitter && (
          <a
            href={currentCollection[0].twitter}
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
