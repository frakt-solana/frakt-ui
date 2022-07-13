import { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { selectUserLoansPending } from '../../../../state/loans/selectors';
import LoanCard from '../../../../components/LoanCard';
import { Loan } from '../../../../state/loans/types';
import styles from './LoansList.module.scss';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/InfinityScroll';

interface LoansListProps {
  className?: string;
  loans: Loan[];
}

export const LoansList: FC<LoansListProps> = ({ className, loans }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const loading: boolean = useSelector(selectUserLoansPending);

  return (
    <InfinityScroll
      itemsToShow={itemsToShow}
      isLoading={loading}
      next={next}
      wrapperClassName={classNames(styles.loansList, className)}
      emptyMessage="Loans not found"
    >
      {loans.map((loan) => (
        <LoanCard key={loan?.mint} loan={loan} />
      ))}
    </InfinityScroll>
  );
};
