import { FC } from 'react';

import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import LoanCard from '../../../components/LoanCard';
import {
  useModalNFTsSlider,
  ModalNFTsSlider,
} from '../../../components/ModalNFTsSlider';
import { useAuctionCountdown } from '../../../contexts/fraktion';
import { useLoans } from '../../../contexts/loans';
import { UserNFT } from '../../../contexts/userTokens';
import { LoanWithNftData } from '../../../utils/loans';
import styles from './LoansList.module.scss';

export interface LoansListProps {
  nfts: UserNFT[];
}

export const LoansList: FC<LoansListProps> = ({ nfts }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const { loansData, loading } = useLoans();

  const {
    isModalVisible,
    setIsModalVisible,
    currentSlide,
    onSliderNavClick,
    setSwiper,
  } = useModalNFTsSlider();

  return (
    <>
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={loading}
        wrapperClassName={styles.loansList}
        emptyMessage="No suitable loans found"
      >
        {loansData.map((nft: LoanWithNftData) => (
          <LoanCard
            key={nft.id}
            imageUrl={nft.nftData?.image}
            name={nft.nftData?.name}
            ltvPrice={nft.amount?.toString()}
            nft={nft}
          />
        ))}
      </FakeInfinityScroll>
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
