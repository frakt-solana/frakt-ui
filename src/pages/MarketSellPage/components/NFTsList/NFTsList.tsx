import styles from './styles.module.scss';
import { FC, useState } from 'react';

import { UserNFT } from '../../../../contexts/userTokens';
import { NFTCard } from '../NFTCard';
import { ModalNFTsSlider } from '../../../../components/ModalNFTsSlider';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';

interface NFTsListProps {
  nfts: UserNFT[];
  onCardClick: (nft: UserNFT) => void;
}

export const NFTsList: FC<NFTsListProps> = ({ nfts, onCardClick }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [swiper, setSwiper] = useState(null);

  const slideTo = (index: number) => {
    if (swiper) swiper.slideTo(index);
  };

  const onNftItemClick = (index: number) => () => {
    setIsModalVisible(true);
    setCurrentSlide(index);
    slideTo(index);
  };

  const onSliderNavClick = () => () => {
    if (swiper) setCurrentSlide(swiper.activeIndex);
  };

  return (
    <>
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={false}
        wrapperClassName={styles.poolsList}
        emptyMessage="No suitable NFTs found"
      >
        {nfts.map((nft, idx) => (
          <NFTCard
            key={nft.mint}
            nft={nft}
            onClick={() => onCardClick(nft)}
            onDetailsClick={onNftItemClick(idx)}
          />
        ))}
      </FakeInfinityScroll>
      <ModalNFTsSlider
        isModalVisible={isModalVisible}
        currentSlide={currentSlide}
        nfts={nfts}
        nftCollections={[]}
        onSliderNavClick={onSliderNavClick}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </>
  );
};
