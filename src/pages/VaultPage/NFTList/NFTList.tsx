import { FC } from 'react';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import { keyBy, Dictionary } from 'lodash';
import classNames from 'classnames';

import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import { CollectionData } from '../../../utils/collections';
import {
  ModalNFTsSlider,
  useModalNFTsSlider,
} from '../../../components/ModalNFTsSlider';
import { safetyBoxWithNftMetadataToUserNFT } from '../../../contexts/fraktion/fraktion.helpers';
import styles from './NFTList.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import { NFTCard } from '../NFTCard';

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
  const { itemsToShow, next } = useFakeInfinityScroll(9);

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
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={false}
        wrapperClassName={classNames(styles.nftList, className)}
        emptyMessage="No NFTs found"
      >
        {safetyBoxes.map((safetyBox, index) => (
          <NFTCard
            key={safetyBox.nftMint}
            safetyBox={safetyBox}
            onClick={() => openOnCertainSlide(index)}
            className={styles.nftCard}
          />
        ))}
      </FakeInfinityScroll>
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
