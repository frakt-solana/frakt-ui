import styles from './styles.module.scss';
import { Dictionary } from 'lodash';
import { FC } from 'react';

import { UserNFT } from '../../contexts/userTokens';
import { NFTCard } from '../NFTCard';
import { ModalNFTsSlider } from '../ModalNFTsSlider';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../FakeInfinityScroll';
import { CollectionData } from '../../utils/collections';
import { useModalNFTsSlider } from '../ModalNFTsSlider/hooks';

interface NFTsListProps {
  nfts: UserNFT[];
  collectionByNftMint?: Dictionary<CollectionData>;
  onCardClick?: (nft: UserNFT) => void;
}

export const NFTsList: FC<NFTsListProps> = ({
  nfts,
  onCardClick = () => {},
  collectionByNftMint = {},
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  const {
    isModalVisible,
    setIsModalVisible,
    currentSlide,
    setCurrentSlide,
    slideTo,
    onSliderNavClick,
    setSwiper,
  } = useModalNFTsSlider();

  const onNftItemClick = (index: number) => () => {
    setIsModalVisible(true);
    setCurrentSlide(index);
    slideTo(index);
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
        collectionByNftMint={collectionByNftMint}
        onSliderNavClick={onSliderNavClick}
        setIsModalVisible={setIsModalVisible}
        setSwiper={setSwiper}
      />
    </>
  );
};
