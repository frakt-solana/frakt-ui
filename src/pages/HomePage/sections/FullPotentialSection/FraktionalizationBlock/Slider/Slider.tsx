import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Autoplay, FreeMode, Navigation, Pagination } from 'swiper';

import styles from './Slider.module.scss';
import { SLIDER_DATA } from './slidersData';
import { MockVaultCard } from './MockVaultCard';

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
      >
        {SLIDER_DATA.map(
          (
            {
              nftsAmount,
              title,
              totalSupply,
              fraktionPrice,
              startBid,
              images,
              owner,
            },
            idx,
          ) => (
            <SwiperSlide key={idx} className={styles.slide}>
              <NavLink
                to={process.env.FRAKT_VAULTS_URL}
                className={styles.slideContent}
              >
                <MockVaultCard
                  nftsAmount={nftsAmount}
                  title={title}
                  totalSupply={totalSupply}
                  fraktionPrice={fraktionPrice}
                  startBid={startBid}
                  images={images}
                  owner={owner}
                />
              </NavLink>
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  );
};
