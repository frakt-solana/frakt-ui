import { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import LoanCard from '../../../../components/LoanCard';
import styles from './LoansList.module.scss';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/InfinityScroll';
import { LoanView } from '../../../../state/loans/types';
import {
  selectUserLoans,
  selectUserLoansPending,
} from '../../../../state/loans/selectors';

interface LoansListProps {
  className?: string;
}

export const LoansList: FC<LoansListProps> = ({ className }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const userLoans: LoanView[] = useSelector(selectUserLoans);
  const loading: boolean = useSelector(selectUserLoansPending);

  return (
    <InfinityScroll
      itemsToShow={itemsToShow}
      isLoading={loading}
      next={next}
      wrapperClassName={classNames(styles.loansList, className)}
      emptyMessage="Loans not found"
    >
      {userLoans.map((loan) => (
        <LoanCard key={loan?.nftMint} loan={loan} />
      ))}
    </InfinityScroll>
  );
};
