import React, { FC, useRef } from 'react';
import styles from './styles.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Scrollbar, Grid } from 'swiper';
import { SLIDER_DATA } from './slidersData';
import { TestimonialCard } from './TestimonialCard';

SwiperCore.use([Navigation, Scrollbar, Grid]);

const THUMBS_SLIDER_BREAKPOINTS = {
  240: { slidesPerView: 1.4, spaceBetween: 15 },
  400: { slidesPerView: 1.5, spaceBetween: 15 },
  701: { slidesPerView: 1.8, spaceBetween: 30 },
  900: { slidesPerView: 2 },
  980: { slidesPerView: 2.3 },
  1201: { slidesPerView: 1.6 },
};

export const Slider: FC = () => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        className={styles.slider}
        navigation={{
          prevEl: prevBtn.current,
          nextEl: nextBtn.current,
        }}
        spaceBetween={30}
        speed={1000}
        scrollbar={{ draggable: true }}
        grid={{ rows: 1 }}
        breakpoints={THUMBS_SLIDER_BREAKPOINTS}
      >
        {SLIDER_DATA.map((slide) => (
          <SwiperSlide
            key={slide.name1 && slide.imageSrc1}
            className={styles.slide}
          >
            <TestimonialCard
              imageSrc={slide.imageSrc1}
              name={slide.name1}
              organisation={slide.organisation1}
              text={slide.text1}
            />
            {slide.name2 && (
              <TestimonialCard
                imageSrc={slide.imageSrc2}
                name={slide.name2}
                organisation={slide.organisation2}
                text={slide.text2}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={prevBtn}
        className={`${styles.sliderNavPrev} sliderNavPrev`}
        onClick={() => null}
      />
      <div
        ref={nextBtn}
        className={`${styles.sliderNavNext} sliderNavNext`}
        onClick={() => null}
      />
    </div>
  );
};
