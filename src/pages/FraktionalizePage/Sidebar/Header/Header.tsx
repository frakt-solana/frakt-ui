import { UserNFT } from '../../../../contexts/userTokens';
import styles from './styles.module.scss';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';

SwiperCore.use([Navigation, Scrollbar]);

interface HeaderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  isBasket: boolean;
  lockedNFT: {
    nftImage: string;
    nftMint: string;
  }[];
}

const sliderBreakpoints = {
  300: { slidesPerView: 3 },
  450: { slidesPerView: 3.6 },
  1450: { slidesPerView: 4 },
};

export const Header = ({
  nfts,
  onDeselect,
  isBasket,
  lockedNFT,
}: HeaderProps): JSX.Element => {
  return (
    <div className={styles.header}>
      <p className={styles.title}>{isBasket ? 'Your NFTs' : 'Your NFT'}</p>
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
    </div>
  );
};
