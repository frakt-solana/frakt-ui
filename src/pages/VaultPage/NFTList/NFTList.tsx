import { FC, useState } from 'react';
import SwiperCore, {
  FreeMode,
  Lazy,
  Navigation,
  Scrollbar,
  Thumbs,
} from 'swiper';

import styles from './styles.module.scss';
import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import classNames from 'classnames';
import { shortenAddress } from '../../../utils/solanaUtils';
import { CollectionData } from '../../../utils/collections';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import { NFTsSliderModal } from '../../../components/NFTsSliderModal';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar, Lazy]);

const MAX_SAFETY_BOXES_LENGTH = 20;

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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [swiper, setSwiper] = useState(null);
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const [slidesToShow, setSlidesToShow] = useState<SafetyBoxWithMetadata[]>([]);

  const slideTo = (index) => {
    if (swiper) swiper.slideTo(index);
  };

  const onNftItemClick = (index) => () => {
    setCurrentSlide(index);
    if (safetyBoxes.length >= MAX_SAFETY_BOXES_LENGTH) {
      setSlidesToShow([safetyBoxes[index]]);
      setIsModalVisible(true);
    } else {
      setSlidesToShow(safetyBoxes);
      setIsModalVisible(true);
      slideTo(index);
    }
  };

  return (
    <div className={styles.wrapper}>
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={false}
        wrapperClassName={classNames(styles.nftList, className)}
        emptyMessage="No NFTs found"
      >
        {safetyBoxes.map((nft, index) => (
          <div
            className={styles.nftListItem}
            key={nft.nftMint}
            onClick={onNftItemClick(index)}
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
          </div>
        ))}
      </FakeInfinityScroll>
      <NFTsSliderModal
        isModalVisible={isModalVisible}
        safetyBoxes={safetyBoxes}
        slidesToShow={slidesToShow}
        nftCollections={nftCollections}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </div>
  );
};
