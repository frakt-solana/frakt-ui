import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { VaultData } from '../../../../contexts/fraktion';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import classNames from 'classnames';
import VaultCard from '../../../../components/VaultCard';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

const SLIDER_BREAKPOINTS = {
  240: { slidesPerView: 1.5, spaceBetween: 20 },
  370: { slidesPerView: 2 },
  600: { slidesPerView: 2.3 },
  701: { slidesPerView: 1.6, spaceBetween: 25 },
  800: { slidesPerView: 1.9 },
  900: { slidesPerView: 2.2 },
  1000: { slidesPerView: 2.5 },
  1100: { slidesPerView: 3 },
  1200: { slidesPerView: 3.3 },
  1300: { slidesPerView: 3.6 },
  1400: { slidesPerView: 3.9 },
};

interface VaultsSliderProps {
  className?: string;
  isAuction?: boolean;
  isLoading?: boolean;
  title?: string;
  vaults: VaultData[];
}

export const VaultsSlider: FC<VaultsSliderProps> = ({
  className,
  isAuction,
  isLoading,
  title,
  vaults,
}) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  if (isLoading) return null;

  return (
    <div
      className={classNames(styles.sliderWrapper, className, {
        [styles.notFirstSlide]: currentSlideIndex > 0,
      })}
    >
      <h3 className={styles.sliderTitle}>
        {title}
        <div
          ref={prevBtn}
          className={classNames(styles.sliderNavPrev, 'sliderNavPrev')}
        />
        <div
          ref={nextBtn}
          className={classNames(styles.sliderNavNext, 'sliderNavNext')}
        />
      </h3>
      <Swiper
        className={styles.slider}
        breakpoints={SLIDER_BREAKPOINTS}
        onRealIndexChange={(swiper) => setCurrentSlideIndex(swiper.realIndex)}
        spaceBetween={24}
        navigation={{
          prevEl: prevBtn.current,
          nextEl: nextBtn.current,
        }}
      >
        {vaults.map((vault) => (
          <SwiperSlide key={vault.vaultPubkey}>
            <VaultCard vaultData={vault} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
