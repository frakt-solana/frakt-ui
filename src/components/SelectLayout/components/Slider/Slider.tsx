import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import classNames from 'classnames';

import { BorrowNFT } from '../../../../contexts/userTokens';
import styles from './Slider.module.scss';

SwiperCore.use([Navigation, Scrollbar]);

const sliderBreakpoints = {
  250: { slidesPerView: 4 },
};

interface SliderProps {
  nfts: BorrowNFT[];
  onDeselect?: (nft: BorrowNFT) => void;
  className?: string;
}

export const Slider: FC<SliderProps> = ({ onDeselect, nfts, className }) => {
  return (
    <Swiper
      className={classNames(styles.nftSlider, className)}
      spaceBetween={18}
      breakpoints={sliderBreakpoints}
      navigation={true}
      scrollbar={{ draggable: true }}
    >
      {nfts.map((nft, idx) => (
        <SwiperSlide key={idx}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${nft.imageUrl})` }}
          >
            <button
              className={styles.removeBtn}
              onClick={() => onDeselect(nft)}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
