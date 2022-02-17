import { FC, MouseEventHandler, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, {
  FreeMode,
  Navigation,
  Scrollbar,
  Thumbs,
  Lazy,
} from 'swiper';
import { HashLink as AnchorLink } from 'react-router-hash-link';
import { SafetyBoxWithMetadata, VaultData } from '../../../contexts/fraktion';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar, Lazy]);

const THUMBS_SLIDER_BREAKPOINTS = {
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
  safetyBoxes?: SafetyBoxWithMetadata[];
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

const MAX_SAFETY_BOX_SIZE = 20;

export const NFTDoubleSlider: FC<NFTDoubleSliderProps> = ({
  vaultData,
  safetyBoxes = [],
  onSlideThumbClick,
  currentSlideData,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState<SafetyBoxWithMetadata[]>([]);

  useEffect(() => {
    if (safetyBoxes.length >= MAX_SAFETY_BOX_SIZE) {
      setSlidesToShow(safetyBoxes.slice(0, MAX_SAFETY_BOX_SIZE));
    } else {
      setSlidesToShow(safetyBoxes);
    }
  }, [safetyBoxes]);

  return (
    <div className={styles.sliders}>
      {!!slidesToShow.length && (
        <Swiper
          slidesPerView={1}
          className={styles.sliderBig}
          thumbs={{ swiper: thumbsSwiper }}
          lazy
        >
          {slidesToShow.map((box) => (
            <SwiperSlide key={box.nftMint}>
              <div
                className={`${styles.slideBig} swiper-lazy`}
                data-background={box.nftImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {slidesToShow.length > 1 && (
        <>
          <Swiper
            breakpoints={THUMBS_SLIDER_BREAKPOINTS}
            spaceBetween={10}
            className={styles.sliderSmall}
            navigation={true}
            scrollbar={{ draggable: true }}
            onSwiper={setThumbsSwiper}
            lazy
          >
            {slidesToShow.map((box, index) => (
              <SwiperSlide
                key={box.nftMint}
                onClick={onSlideThumbClick(
                  box.nftName,
                  box.nftCollectionName,
                  index,
                )}
              >
                <div
                  className={`${styles.slideSmall} swiper-lazy`}
                  data-background={box.nftImage}
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
        </>
      )}
      <AnchorLink smooth to="#allNftList" className={styles.toNftList}>
        See all NFTs inside the vault
      </AnchorLink>
    </div>
  );
};
