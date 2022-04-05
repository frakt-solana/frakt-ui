import { FC } from 'react';

import { LoanWithNftData } from '../../../../utils/loans';
import LoanCard from '../../../../components/LoanCard';
import { Loader } from '../../../../components/Loader';
import { useLoans } from '../../../../contexts/loans';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';

export const LoansTab: FC = () => {
  const { loansData, loading } = useLoans();
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
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
      )}
    </>
  );
};
