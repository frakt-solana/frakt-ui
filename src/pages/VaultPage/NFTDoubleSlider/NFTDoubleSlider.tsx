import React, { FC, MouseEventHandler, useState } from 'react';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import { HashLink as AnchorLink } from 'react-router-hash-link';
import { SafetyBoxWithMetadata, VaultData } from '../../../contexts/fraktion';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

const thumbSliderBreakpoints = {
  240: { slidesPerView: 2.5 },
  360: { slidesPerView: 3 },
  400: { slidesPerView: 3.5 },
  480: { slidesPerView: 4 },
  600: { slidesPerView: 4.5 },
  767: { slidesPerView: 3.2 },
  1023: { slidesPerView: 3.8 },
};

interface NFTDoubleSliderProps {
  vaultData: VaultData;
  sortedSafetyBoxes: SafetyBoxWithMetadata[];
  onSlideThumbClick: (
    nftName: string,
    nftCollectionName: string,
    nftIndex: number,
  ) => MouseEventHandler<HTMLElement>;
  currentSlideData: {
    nftName: string;
    nftIndex: number;
  };
}

export const NFTDoubleSlider: FC<NFTDoubleSliderProps> = ({
  vaultData,
  sortedSafetyBoxes,
  onSlideThumbClick,
  currentSlideData,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className={styles.sliders}>
      <Swiper
        slidesPerView={1}
        className={styles.sliderBig}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {sortedSafetyBoxes.map((box) => (
          <SwiperSlide key={box.vaultPubkey}>
            <div
              className={styles.slideBig}
              style={{ backgroundImage: `url(${box.nftImage})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {vaultData?.safetyBoxes.length > 1 && (
        <>
          <Swiper
            breakpoints={thumbSliderBreakpoints}
            spaceBetween={10}
            className={styles.sliderSmall}
            navigation={true}
            scrollbar={{ draggable: true }}
            onSwiper={setThumbsSwiper}
          >
            {sortedSafetyBoxes.map((box, index) => (
              <SwiperSlide
                key={box.vaultPubkey}
                onClick={onSlideThumbClick(
                  box.nftName,
                  box.nftCollectionName,
                  index,
                )}
              >
                <div
                  className={styles.slideSmall}
                  style={{ backgroundImage: `url(${box.nftImage})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <p className={styles.nftName}>
            <span>
              {currentSlideData.nftIndex}/{vaultData?.safetyBoxes.length}
            </span>
            {currentSlideData.nftName}
          </p>
          <AnchorLink smooth to="#allNftList" className={styles.toNftList}>
            See all NFTs Inside the Vault
          </AnchorLink>
        </>
      )}
    </div>
  );
};
