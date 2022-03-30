import { FC, useEffect } from 'react';

import { UserNFT } from '../../../contexts/userTokens';
import { LoanWithNftData } from '../../../utils/loans';
import LoanCard from '../../../components/LoanCard';
import { useLoans } from '../../../contexts/loans';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../components/FakeInfinityScroll';
import {
  useModalNFTsSlider,
  ModalNFTsSlider,
} from '../../../components/ModalNFTsSlider';
import styles from './LoansList.module.scss';

export interface LoansListProps {
  nfts: UserNFT[];
}

export const LoansList: FC<LoansListProps> = ({ nfts }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const { loansData, loading, fetchLoansData } = useLoans();

  useEffect(() => {
    (async () => {
      await fetchLoansData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            ltvPrice={nft.amount}
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
