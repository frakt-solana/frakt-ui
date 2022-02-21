import { FC } from 'react';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';

import { UserNFT } from '../../../../../contexts/userTokens';

SwiperCore.use([Navigation, Scrollbar]);

const sliderBreakpoints = {
  250: { slidesPerView: 3 },
  320: { slidesPerView: 3.6 },
  1450: { slidesPerView: 4 },
};

interface SliderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  lockedNFT: {
    nftImage: string;
    nftMint: string;
  }[];
}

export const Slider: FC<SliderProps> = ({ lockedNFT, onDeselect, nfts }) => {
  return (
    <Swiper
      className={styles.nftSlider}
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
