import { FC, useRef, useState } from 'react';
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
import { Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/lazy/lazy.scss';
import 'swiper/modules/thumbs/thumbs';
import { CloseModalIcon } from '../../../icons';
import { CollectionData } from '../../../utils/collections';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import { SlideItem } from './SlideItem';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar, Lazy]);

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [swiper, setSwiper] = useState(null);
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const [slidesToShow, setSlidesToShow] = useState<SafetyBoxWithMetadata[]>([]);

  const safetyBoxesWithCollectionData: Array<
    SafetyBoxWithMetadata & { collectionInfo: CollectionData }
  > = slidesToShow.map((box) => ({
    ...box,
    collectionInfo: nftCollections.find(
      (coll) => coll.collectionName === box.nftCollectionName,
    ),
  }));

  const slideTo = (index) => {
    if (swiper) swiper.slideTo(index);
  };

  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const onNftItemClick = (index) => () => {
    console.log('1 ->', index);
    setCurrentSlide(index);
    if (safetyBoxes.length >= 30) {
      if (index > 4) {
        setSlidesToShow(safetyBoxes.slice(index - 5, index + 5));
        setIsModalVisible(true);
        slideTo(5);
        console.log('2 ->', index);
      } else {
        setSlidesToShow(safetyBoxes.slice(0, 10));
        setIsModalVisible(true);
        slideTo(index);
        console.log('3 ->', index);
      }
    } else {
      setSlidesToShow(safetyBoxes);
      setIsModalVisible(true);
      slideTo(index);
      console.log('4 ->', index);
    }
    console.log('5 ->', index);
  };

  const prependSlides = (slides: number) => {
    const slidesToAdd = safetyBoxes.slice(currentSlide - slides, currentSlide);
    // console.log(currentSlide, slidesToAdd);
    setSlidesToShow([...slidesToAdd, ...slidesToShow]);
  };

  const appendSlides = (slides: number) => {
    const slidesToAdd = safetyBoxes.slice(currentSlide, currentSlide + slides);
    setSlidesToShow([...slidesToShow, ...slidesToAdd]);
  };

  const onSliderNavPrevClick = () => {
    if (safetyBoxes.length >= 30) {
      if (currentSlide <= 0) return;
      setCurrentSlide(currentSlide - 1);
      // console.log(swiper.activeIndex);
      if (swiper && swiper.activeIndex === 1) {
        prependSlides(5);
        // console.log('prepend');
      }
    } else {
      if (swiper) setCurrentSlide(swiper.activeIndex);
    }
  };
  const onSliderNavNextClick = () => {
    if (safetyBoxes.length >= 30) {
      if (currentSlide >= safetyBoxes.length) return;
      setCurrentSlide(currentSlide + 1);
      if (swiper && swiper.activeIndex === swiper.slides.length - 1) {
        console.log(swiper.slides.length);
        appendSlides(5);
      }
    } else {
      if (swiper) setCurrentSlide(swiper.activeIndex);
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
      <Modal
        visible={isModalVisible}
        className={styles.modal}
        width={820}
        footer={false}
        closable={false}
        centered
        onCancel={() => setIsModalVisible(false)}
      >
        <div className={styles.closeModalSection}>
          <span className={styles.slideNumber}>
            {currentSlide + 1}/{safetyBoxes.length}
          </span>
          <div
            className={styles.closeModalIcon}
            onClick={() => setIsModalVisible(false)}
          >
            <CloseModalIcon className={styles.closeIcon} />
          </div>
        </div>
        <div className={styles.sliderWrapper}>
          <Swiper
            navigation={{
              prevEl: prevBtn.current,
              nextEl: nextBtn.current,
            }}
            initialSlide={currentSlide}
            onSwiper={setSwiper}
            autoHeight={true}
            lazy
          >
            {safetyBoxesWithCollectionData.map((slide) => (
              <SwiperSlide key={slide.nftMint} className={styles.slide}>
                <SlideItem slide={slide} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            ref={prevBtn}
            className={styles.sliderNavPrev}
            onClick={onSliderNavPrevClick}
          />
          <div
            ref={nextBtn}
            className={styles.sliderNavNext}
            onClick={onSliderNavNextClick}
          />
        </div>
      </Modal>
    </div>
  );
};
