import { FC } from 'react';

import LoanCard from '../../../../components/LoanCard';
import { Loader } from '../../../../components/Loader';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';

export const LoansTab: FC = () => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  return (
    <>
      {itemsToShow ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          wrapperClassName={styles.loansList}
          emptyMessage="No suitable loans found"
        >
          {[].map((nft: any) => (
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
