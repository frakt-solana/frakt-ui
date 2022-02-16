import { Modal } from 'antd';
import styles from './styles.module.scss';
import { CloseModalIcon } from '../../icons/CloseModalIcon';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { SlideItem } from './SlideItem';
import { FC, useRef } from 'react';
import { SafetyBoxWithMetadata } from '../../contexts/fraktion';
import { CollectionData } from '../../utils/collections';

interface NFTsSliderModalProps {
  isModalVisible: boolean;
  currentSlide: number;
  safetyBoxes?: SafetyBoxWithMetadata[];
  slidesToShow?: SafetyBoxWithMetadata[];
  nftCollections: CollectionData[];
  setSwiper: (swiper: any) => void;
  setIsModalVisible: (status: boolean) => void;
  setCurrentSlide: (index: number) => void;
}

export const NFTsSliderModal: FC<NFTsSliderModalProps> = ({
  isModalVisible,
  currentSlide,
  safetyBoxes,
  slidesToShow,
  nftCollections,
  setSwiper,
  setIsModalVisible,
  setCurrentSlide,
}) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const onSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const safetyBoxesWithCollectionData: Array<
    SafetyBoxWithMetadata & { collectionInfo: CollectionData }
  > = slidesToShow.map((box) => ({
    ...box,
    collectionInfo: nftCollections.find(
      (coll) => coll.collectionName === box.nftCollectionName,
    ),
  }));

  return (
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
          onSlideChange={onSlideChange}
          lazy
        >
          {safetyBoxesWithCollectionData.map((slide) => (
            <SwiperSlide key={slide.nftMint} className={styles.slide}>
              <SlideItem slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div ref={prevBtn} className={styles.sliderNavPrev} />
        <div ref={nextBtn} className={styles.sliderNavNext} />
      </div>
    </Modal>
  );
};
