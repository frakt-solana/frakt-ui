import { FC, useRef, useState } from 'react';
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import { VaultData } from '../../../../contexts/fraktion';
import VaultCard from '../../../../components/VaultCard';
import { PATHS } from '../../../../constants';
import styles from './VaultsSlider.module.scss';

SwiperCore.use([Navigation, Autoplay]);

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
  const [, forceUpdate] = useState();
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
          ref={(element) => {
            prevBtn.current = element;
            forceUpdate(null);
          }}
          className={styles.sliderNavPrev}
        />
        <div
          ref={(element) => {
            nextBtn.current = element;
            forceUpdate(null);
          }}
          className={styles.sliderNavNext}
        />
      </h3>
      {!!(prevBtn.current && prevBtn.current) && (
        <Swiper
          className={styles.slider}
          breakpoints={SLIDER_BREAKPOINTS}
          onRealIndexChange={(swiper) => setCurrentSlideIndex(swiper.realIndex)}
          spaceBetween={24}
          navigation={{
            prevEl: prevBtn.current,
            nextEl: nextBtn.current,
          }}
          speed={1000}
        >
          {vaults.map((vault) => (
            <SwiperSlide key={vault.vaultPubkey}>
              <NavLink to={`${PATHS.VAULT}/${vault.vaultPubkey}`}>
                <VaultCard vaultData={vault} isAuction={isAuction} />
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
