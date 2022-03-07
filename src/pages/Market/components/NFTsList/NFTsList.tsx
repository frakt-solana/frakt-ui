import styles from './styles.module.scss';
import { Dictionary } from 'lodash';
import { FC } from 'react';

import { UserNFTWithCollection } from '../../../../contexts/userTokens';
import { NFTCard } from '../NFTCard';
import {
  ModalNFTsSlider,
  useModalNFTsSlider,
} from '../../../../components/ModalNFTsSlider';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';
import { CollectionData } from '../../../../utils/collections';

export interface NFTsListProps {
  nfts: UserNFTWithCollection[];
  selectedNft?: UserNFTWithCollection;
  collectionByNftMint?: Dictionary<CollectionData>;
  onCardClick?: (nft: UserNFTWithCollection) => void;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  selectedNft,
  onCardClick,
  collectionByNftMint = {},
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

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
            onClick={onCardClick && (() => onCardClick(nft))}
            onDetailsClick={() => openOnCertainSlide(idx)}
            isSelected={selectedNft?.mint === nft.mint}
          />
        ))}
      </FakeInfinityScroll>
      <ModalNFTsSlider
        isModalVisible={isModalVisible}
        currentSlide={currentSlide}
        nfts={nfts}
        collectionByNftMint={collectionByNftMint}
        onSliderNavClick={onSliderNavClick}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </>
  );
};
