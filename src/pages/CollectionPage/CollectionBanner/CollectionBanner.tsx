import { FC } from 'react';
import { DiscordIcon, TwitterIcon2 as TwitterIcon } from '../../../icons';
import { WebsiteIcon } from '../../../icons/WebsiteIcon';
import { CollectionData } from '../../../utils/collections';

import styles from './styles.module.scss';

interface CollectionBannerProps {
  currentCollection: CollectionData;
}

export const CollectionBanner: FC<CollectionBannerProps> = ({
  currentCollection,
}) => {
  const { image, name, website, discord, twitter } = currentCollection;

  return (
    <div className={styles.banner}>
      <div
        className={styles.bgImage}
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
      <img className={styles.thumbnail} src={image} />
      <div className={styles.title}>{name}</div>
      <div className={styles.socialLinks}>
        {website && (
          <a href={website} target="_bank" rel="noopener noreferrer">
            <WebsiteIcon width={46} alt="website" />
          </a>
        )}
        {discord && (
          <a href={discord} target="_bank" rel="noopener noreferrer">
            <DiscordIcon width={48} alt="discord" />
          </a>
        )}
        {twitter && (
          <a href={twitter} target="_bank" rel="noopener noreferrer">
            <TwitterIcon width={48} alt="twitter" />
          </a>
        )}
      </div>
    </div>
  );
};
