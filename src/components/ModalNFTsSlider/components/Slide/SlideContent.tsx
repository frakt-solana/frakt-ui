import { FC } from 'react';

import { UserNFT } from '../../../../state/userTokens/types';
import { CopyClipboardIcon } from '../../../../icons';
import { copyToClipboard } from '../../../../utils';
import { shortenAddress } from '../../../../utils/solanaUtils';
import Tooltip from '../../../Tooltip';
import styles from './styles.module.scss';

interface SlideContent {
  nft: UserNFT;
}

export const SlideContent: FC<SlideContent> = ({ nft }) => {
  const { metadata } = nft;

  return (
    <div className={styles.slide}>
      <div
        style={{ backgroundImage: `url(${nft.metadata.image})` }}
        className={styles.slideImage}
      />
      <div className={styles.slideInfoBlock}>
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
