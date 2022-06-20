import { FC, useRef } from 'react';
import { Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';

import { CloseModalIcon } from '../../icons/CloseModalIcon';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';

import { UserNFT } from '../../state/userTokens/types';
import { SlideContent } from './components';
import styles from './styles.module.scss';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

interface ModalNFTsSliderProps {
  isModalVisible: boolean;
  currentSlide: number;
  className?: string;
  nfts: UserNFT[];
  onSliderNavClick: () => void;
  setIsModalVisible: (status: boolean) => void;
  setSwiper: (swiper: SwiperCore) => void;
}

const MAX_NFTS_LENGTH = 20;

export const ModalNFTsSlider: FC<ModalNFTsSliderProps> = ({
  className,
  nfts: rawNfts,
  isModalVisible,
  currentSlide,
  setIsModalVisible,
  setSwiper,
  onSliderNavClick,
}) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const nfts =
    rawNfts.length > MAX_NFTS_LENGTH ? [rawNfts[currentSlide]] : rawNfts;

  return (
    <Modal
      visible={isModalVisible}
      className={`${styles.modal} ${className}`}
      width={820}
      footer={false}
      closable={false}
      centered
      onCancel={() => setIsModalVisible(false)}
    >
      <div className={styles.closeModalSection}>
        <span className={styles.slideNumber}>
          {currentSlide + 1}/{rawNfts.length}
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
          onSlideChange={onSliderNavClick}
        >
          {nfts.map((nft) => (
            <SwiperSlide key={nft.mint}>
              <SlideContent key={nft.mint} nft={nft} />
            </SwiperSlide>
          ))}
        </Swiper>
        {nfts.length > 1 && (
          <>
            <div
              ref={prevBtn}
              className={styles.sliderNavPrev}
              onClick={onSliderNavClick}
            />
            <div
              ref={nextBtn}
              className={styles.sliderNavNext}
              onClick={onSliderNavClick}
            />
          </>
        )}
      </div>
    </Modal>
  );
};
