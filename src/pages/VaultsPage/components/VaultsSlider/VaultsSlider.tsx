import React, { FC, useRef } from 'react';
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
  240: {
    slidesPerView: 3.9,
    spaceBetween: 24,
  },
};

interface VaultsSliderProps {
  className?: string;
  isAuction?: boolean;
  title?: string;
  vaults: VaultData[];
}

export const VaultsSlider: FC<VaultsSliderProps> = ({
  className,
  isAuction,
  title,
  vaults,
}) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  return (
    <div className={classNames(styles.sliderWrapper, className)}>
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
