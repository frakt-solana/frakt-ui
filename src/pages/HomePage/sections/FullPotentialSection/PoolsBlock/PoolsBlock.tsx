import React, { FC, useRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { PoolsInfoIcon } from '../../../../../icons';
import { BlockContent } from '../BlockContent';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Autoplay, Scrollbar } from 'swiper';
import { PoolCard } from './PoolCard';

SwiperCore.use([Navigation, Autoplay, Scrollbar]);

interface PoolsBlockProps {
  className?: string;
}

export const PoolsBlock: FC<PoolsBlockProps> = ({ className }) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Pools'}
        icon={<PoolsInfoIcon />}
        text={'Instantly buy, sell and swap NFTs'}
      />
      <div className={styles.sliderWrapper}>
        <Swiper
          slidesPerView={2.5}
          className={styles.slider}
          navigation={{
            prevEl: prevBtn.current,
            nextEl: nextBtn.current,
          }}
          loop={true}
          loopAdditionalSlides={1}
          spaceBetween={25}
          speed={1000}
          scrollbar={{ draggable: true }}
          // autoplay={{ delay: 5000, disableOnInteraction: false }}
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
        />
        <div
          ref={nextBtn}
          className={`${styles.sliderNavNext} sliderNavNext`}
        />
      </div>
    </div>
  );
};
