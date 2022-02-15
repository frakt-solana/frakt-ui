import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../constants';
import { copyToClipboard, getCollectionThumbnailUrl } from '../../../utils';
import { shortenAddress } from '../../../utils/solanaUtils';
import Tooltip from '../../../components/Tooltip';
import { CopyClipboardIcon } from '../../../icons/CopyClipboardIcon';
import { FC } from 'react';
import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import { CollectionData } from '../../../utils/collections';

interface SlideItemProps {
  slide: SafetyBoxWithMetadata & { collectionInfo: CollectionData };
}

export const SlideItem: FC<SlideItemProps> = ({ slide }) => {
  return (
    <>
      <div
        data-background={slide.nftImage}
        className={`${styles.slideImage} swiper-lazy`}
      />
      <div className={styles.slideInfoBlock}>
        {slide.collectionInfo?.collectionName && (
          <NavLink
            to={`${PATHS.COLLECTION}/${slide.collectionInfo?.collectionName}`}
            className={styles.collectionLink}
          >
            <div
              className={styles.collectionIcon}
              style={{
                backgroundImage: `url(${getCollectionThumbnailUrl(
                  slide.collectionInfo?.thumbnailPath,
                )})`,
              }}
            />
            <p className={styles.collectionName}>
              {slide.collectionInfo?.collectionName}
            </p>
          </NavLink>
        )}
        <h5 className={styles.nftTitle}>{slide.nftName}</h5>
        {slide.nftDescription && (
          <p className={styles.NftDescription}>{slide.nftDescription}</p>
        )}
        {!!slide.nftAttributes?.length && (
          <div className={styles.attributesTable}>
            {slide.nftAttributes.map(({ trait_type, value }, idx) => (
              <div key={idx} className={styles.attributesTable__row}>
                <p>{trait_type}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
        <p className={styles.nftInfoLabel}>NFT MINT</p>
        <p
          className={styles.nftInfoItem}
          onClick={() => copyToClipboard(slide.nftMint)}
        >
          {shortenAddress(slide.nftMint)}
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="Click to copy to clipboard"
          >
            <CopyClipboardIcon className={styles.copyIcon} width={24} />
          </Tooltip>
        </p>
      </div>
    </>
  );
};
