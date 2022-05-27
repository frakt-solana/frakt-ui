import { FC, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './MockVaultCard.module.scss';
import Badge, { VerifiedBadge } from '../../../../../../../components/Badge';

export interface MockVaultCardProps {
  nftsAmount: string;
  title: string;
  totalSupply: string;
  fraktionPrice: string;
  startBid: string;
  images: string[];
  owner: {
    avatarUrl: string;
    name: string;
  };
}

export const MockVaultCard: FC<MockVaultCardProps> = ({
  nftsAmount,
  title,
  images,
  owner,
  totalSupply,
  fraktionPrice,
  startBid,
}) => {
  const [imageHoverIndex, setImageHoverIndex] = useState<number>(0);

  const onImageMouseEnter = (imageNumberIndex) => () => {
    setImageHoverIndex(imageNumberIndex);
  };
  const onImageMouseLeave = () => () => {
    setImageHoverIndex(0);
  };
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.mainAppearance}>
          <div
            className={classNames(
              styles.imageWrapper,
              styles[`imageHovered${imageHoverIndex}`],
              {
                [styles.has1Img]: !!images[0],
                [styles.has2Img]: !!images[1],
                [styles.has3Img]: !!images[2],
              },
            )}
          >
            <div
              style={{
                backgroundImage: `url(${images[0]})`,
              }}
              className={styles.vaultImage}
            />
            <div
              style={{
                backgroundImage: `url(${images[1]})`,
              }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(1)}
              onMouseLeave={onImageMouseLeave()}
            />
            <div
              style={{
                backgroundImage: `url(${images[2]})`,
              }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(2)}
              onMouseLeave={onImageMouseLeave()}
            />
          </div>
          <div className={styles.actions}>
            <VerifiedBadge />
            <Badge label="Active" className={styles.badge} />
            <Badge label="Tradable" className={styles.badge} />
            <Badge label={nftsAmount} className={styles.badge} />
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{title}</div>
          <div className={styles.owner}>
            <img className={styles.owner__avatar} src={owner.avatarUrl} />
            {owner.name}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Total supply</div>
            <div className={styles.value}>{totalSupply}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Fraktion price&nbsp;(SOL)</div>
            <div className={styles.value}>{fraktionPrice}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Start bid (SOL)</div>
            <div className={styles.value}>{startBid}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
