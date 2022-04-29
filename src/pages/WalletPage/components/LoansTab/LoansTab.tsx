import { FC } from 'react';
import { LoanView } from '@frakters/nft-lending-v2';

import LoanCard from '../../../../components/LoanCard';
import { Loader } from '../../../../components/Loader';
import { useLoans } from '../../../../contexts/loans';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';

export const LoansTab: FC = () => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const { loading, loansProgramAccounts } = useLoans();

  const filteredLoans = loansProgramAccounts?.loans.filter(({ loanStatus }) => {
    return loanStatus?.activated;
  });

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          isLoading={loading}
          next={next}
          wrapperClassName={styles.loansList}
          emptyMessage="No suitable loans found"
        >
          {filteredLoans.map((loan: LoanView) => (
            <LoanCard key={loan.loanPubkey} loan={loan} />
          ))}
        </FakeInfinityScroll>
      )}
    </>
  );
};
