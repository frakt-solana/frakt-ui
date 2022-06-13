import { FC } from 'react';

import styles from './NFTsList.module.scss';
import { UserNFTWithCollection } from '../../../../state/userTokens/types';
import { NFTCard } from '../NFTCard';
import {
  ModalNFTsSlider,
  useModalNFTsSlider,
} from '../../../../components/ModalNFTsSlider';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/InfinityScroll';

export interface NFTsListProps {
  nfts: UserNFTWithCollection[];
  selectedNft?: UserNFTWithCollection;
  onCardClick?: (nft: UserNFTWithCollection) => void;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  selectedNft,
  onCardClick,
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(15);

  const {
    isModalVisible,
    setIsModalVisible,
    currentSlide,
    onSliderNavClick,
    setSwiper,
    openOnCertainSlide,
  } = useModalNFTsSlider();

  return (
    <>
      <InfinityScroll
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
            onClick={onCardClick && (() => onCardClick(nft))}
            onDetailsClick={() => openOnCertainSlide(idx)}
            isSelected={selectedNft?.mint === nft.mint}
          />
        ))}
      </InfinityScroll>
      <ModalNFTsSlider
        isModalVisible={isModalVisible}
        currentSlide={currentSlide}
        nfts={nfts}
        onSliderNavClick={onSliderNavClick}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </>
  );
};
