import { FC } from 'react';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import { keyBy, Dictionary } from 'lodash';
import classNames from 'classnames';

import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import { shortenAddress } from '../../../utils/solanaUtils';
import { CollectionData } from '../../../utils/collections';
import {
  ModalNFTsSlider,
  useModalNFTsSlider,
} from '../../../components/ModalNFTsSlider';
import { safetyBoxWithNftMetadataToUserNFT } from '../../../contexts/fraktion/fraktion.helpers';
import styles from './styles.module.scss';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

interface NFTListProps {
  safetyBoxes?: SafetyBoxWithMetadata[];
  nftCollections: CollectionData[];
  className?: string;
}

export const NFTList: FC<NFTListProps> = ({
  safetyBoxes = [],
  nftCollections,
  className,
}) => {
  const {
    isModalVisible,
    setIsModalVisible,
    currentSlide,
    onSliderNavClick,
    setSwiper,
    openOnCertainSlide,
  } = useModalNFTsSlider();

  const nfts = safetyBoxes.map(safetyBoxWithNftMetadataToUserNFT);

  const collectionByName = keyBy(nftCollections, 'collectionName');
  const collectionByNftMint: Dictionary<CollectionData> = safetyBoxes.reduce(
    (acc, safetyBox) => {
      const { nftMint, nftCollectionName } = safetyBox;

      const collection = collectionByName[nftCollectionName];
      if (collection) {
        return { ...acc, [nftMint]: collection };
      }

      return acc;
    },
    {},
  );

  return (
    <div className={styles.wrapper}>
      <ul className={classNames(styles.nftList, className)}>
        {safetyBoxes.map((nft, index) => (
          <li
            className={styles.nftListItem}
            key={nft.nftMint}
            onClick={() => openOnCertainSlide(index)}
          >
            <div
              style={{ backgroundImage: `url(${nft.nftImage})` }}
              className={styles.nftImage}
            />
            <div className={styles.nftInfoBlock}>
              <h5 className={styles.nftTitle}>{nft.nftName}</h5>
              <span className={styles.nftInfoLabel}>NFT MINT</span>
              <span className={styles.nftInfoItem}>
                {shortenAddress(nft.nftMint)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <ModalNFTsSlider
        isModalVisible={isModalVisible}
        currentSlide={currentSlide}
        nfts={nfts}
        collectionByNftMint={collectionByNftMint}
        onSliderNavClick={onSliderNavClick}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </div>
  );
};
