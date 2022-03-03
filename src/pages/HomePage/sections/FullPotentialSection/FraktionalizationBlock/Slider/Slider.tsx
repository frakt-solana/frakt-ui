import React, { FC } from 'react';
import styles from './styles.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Autoplay, FreeMode, Navigation, Pagination } from 'swiper';
import { NavLink } from 'react-router-dom';
import { SLIDER_DATA } from './slidersData';
import { PATHS } from '../../../../../../constants';
import VaultCard from '../../../../../../components/VaultCard';

SwiperCore.use([FreeMode, Navigation, Pagination, Autoplay]);

export const Slider: FC = () => {
  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        slidesPerView={1.5}
        className={styles.slider}
        centeredSlides
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        loopAdditionalSlides={1}
        spaceBetween={0}
        speed={1000}
        autoplay={{ delay: 5000 }}
      >
        {SLIDER_DATA.map((slide) => (
          <SwiperSlide key={slide.vaultPubkey} className={styles.slide}>
            <div className={styles.slideContent}>
              <NavLink to={PATHS.VAULTS} className={styles.visualWrapper}>
                <VaultCard vaultData={slide} />
              </NavLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
