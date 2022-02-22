import React, { FC, useRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { BlockContent } from '../BlockContent';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Autoplay, Scrollbar } from 'swiper';
import { PoolCard } from './PoolCard';
import { PoolsInfoIcon } from '../../../svg';

SwiperCore.use([Navigation, Autoplay, Scrollbar]);

interface PoolsBlockProps {
  className?: string;
}

const SLIDER_BREAKPOINTS = {
  240: { slidesPerView: 1.2, spaceBetween: 16 },
  340: { slidesPerView: 1.5, spaceBetween: 16 },
  370: { slidesPerView: 2, spaceBetween: 25 },
  500: { slidesPerView: 2.5 },
};

export const PoolsBlock: FC<PoolsBlockProps> = ({ className }) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Pools'}
        icon={<PoolsInfoIcon />}
        text={'Instantly buy, sell and swap NFTs'}
        disabled
      />
      <div className={styles.sliderWrapper}>
        <Swiper
          breakpoints={SLIDER_BREAKPOINTS}
          className={styles.slider}
          navigation={{
            prevEl: prevBtn.current,
            nextEl: nextBtn.current,
          }}
          speed={1000}
          scrollbar={{ draggable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          <SwiperSlide>
            <PoolCard />
          </SwiperSlide>
          <SwiperSlide>
            <PoolCard />
          </SwiperSlide>
          <SwiperSlide>
            <PoolCard />
          </SwiperSlide>
          <SwiperSlide>
            <PoolCard />
          </SwiperSlide>
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
    </div>
  );
};
