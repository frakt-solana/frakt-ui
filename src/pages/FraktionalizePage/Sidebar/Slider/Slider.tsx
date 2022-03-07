import { FC } from 'react';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import classNames from 'classnames/bind';

import { UserNFT } from '../../../../contexts/userTokens';

SwiperCore.use([Navigation, Scrollbar]);

const sliderBreakpoints = {
  250: { slidesPerView: 4 },
};

interface SliderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  lockedNFT: {
    nftImage: string;
    nftMint: string;
  }[];
  className?: string;
}

export const Slider: FC<SliderProps> = ({
  lockedNFT,
  onDeselect,
  nfts,
  className,
}) => {
  return (
    <Swiper
      className={classNames(styles.nftSlider, className)}
      spaceBetween={18}
      breakpoints={sliderBreakpoints}
      navigation={true}
      scrollbar={{ draggable: true }}
    >
      {lockedNFT.map(({ nftImage, nftMint }) => (
        <SwiperSlide
          key={nftMint}
          className={styles.image}
          style={{ backgroundImage: `url(${nftImage})` }}
        />
      ))}
      {nfts.map((nft, idx) => (
        <SwiperSlide
          key={idx}
          className={styles.image}
          style={{ backgroundImage: `url(${nft?.metadata?.image})` }}
        >
          <button
            className={styles.removeBtn}
            onClick={() => onDeselect(nft)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
