import React, { FC } from 'react';
import styles from './styles.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { FreeMode, Navigation, Pagination, Autoplay } from 'swiper';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { SLIDER_DATA } from './slidersData';

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
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {SLIDER_DATA.map((slide) => (
          <SwiperSlide
            key={slide.imagesSrc || slide.videosSrc}
            className={styles.slide}
          >
            <div className={styles.slideContent}>
              <NavLink to={slide.url} className={styles.visualWrapper}>
                {slide.imagesSrc && (
                  <img
                    className={styles.slideImage}
                    src={slide.imagesSrc}
                    alt={slide.name}
                  />
                )}
                {slide.videosSrc && (
                  <video
                    autoPlay
                    muted
                    loop
                    height="100%"
                    width="100%"
                    className={styles.slideVideo}
                  >
                    <source src={slide.videosSrc} type="video/mp4" />
                  </video>
                )}
                <p className={classNames(styles.label, styles[slide.label])}>
                  {slide.label}
                </p>
              </NavLink>
              <div className={styles.content}>
                <p className={styles.slideName}>{slide.name}</p>
                <a
                  href={slide.artistLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.slideArtist}
                >
                  {slide.artist}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
