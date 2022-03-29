import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { UserNFT } from '../../../../contexts/userTokens';
import { CopyClipboardIcon } from '../../../../icons';
import { copyToClipboard } from '../../../../utils';
import { CollectionData } from '../../../../utils/collections';
import { shortenAddress } from '../../../../utils/solanaUtils';
import Tooltip from '../../../Tooltip';
import { PATHS } from '../../../../constants';
import styles from './styles.module.scss';

interface SlideContent {
  nft: UserNFT;
  collection?: CollectionData;
}

export const SlideContent: FC<SlideContent> = ({ nft, collection }) => {
  const { metadata } = nft;

  return (
    <div className={styles.slide}>
      <div
        style={{ backgroundImage: `url(${nft.metadata.image})` }}
        className={styles.slideImage}
      />
      <div className={styles.slideInfoBlock}>
        {!!collection && (
          <NavLink
            to={`${PATHS.COLLECTION}/${collection?.name}`}
            className={styles.collectionLink}
          >
            <div
              className={styles.collectionIcon}
              style={{
                backgroundImage: `url(${collection?.image})`,
              }}
            />
            <p className={styles.collectionName}>{collection?.image}</p>
          </NavLink>
        )}
        <h5 className={styles.nftTitle}>{metadata.name}</h5>
        {!!metadata.description && (
          <p className={styles.NftDescription}>{metadata.description}</p>
        )}
        {!!metadata.attributes?.length && (
          <div className={styles.attributesTable}>
            {metadata.attributes.map(({ trait_type, value }, idx) => (
              <div key={idx} className={styles.attributesTable__row}>
                <p>{trait_type}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
        <p className={styles.nftInfoLabel}>NFT mint</p>
        <p
          className={styles.nftInfoItem}
          onClick={() => copyToClipboard(nft.mint)}
        >
          {shortenAddress(nft.mint)}
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="Click to copy to clipboard"
          >
            <CopyClipboardIcon className={styles.copyIcon} width={24} />
          </Tooltip>
        </p>
      </div>
    </div>
  );
};
