import { FC } from 'react';

import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import LoanCard from '../../../components/LoanCard';
import {
  useModalNFTsSlider,
  ModalNFTsSlider,
} from '../../../components/ModalNFTsSlider';
import { useLoans } from '../../../contexts/loans/loans.hooks';
import { UserNFT } from '../../../contexts/userTokens';
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
    openOnCertainSlide,
  } = useModalNFTsSlider();

  return (
    <>
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        isLoading={false}
        wrapperClassName={styles.loansList}
        emptyMessage="No suitable loans found"
      >
        {nfts.map((nft, idx) => (
          <LoanCard
            key={nft.mint}
            onDetailsClick={() => openOnCertainSlide(idx)}
            imageUrl={nft.metadata.image}
            name={nft.metadata.name}
            ltvPrice={'33'}
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
