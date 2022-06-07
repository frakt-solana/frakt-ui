import { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import LoanCard from '../../../../components/LoanCard';
import styles from './LoansList.module.scss';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/InfinityScroll';
import { LoanWithArweaveMetadata } from '../../../../contexts/loans';
import { LoanWithMetadata } from '../../../../state/loans/types';
import {
  selectUserLoans,
  selectUserLoansPending,
} from '../../../../state/loans/selectors';

interface LoansListProps {
  className?: string;
  loansWithArweaveMetadata?: LoanWithArweaveMetadata[];
  loading?: boolean;
}

export const LoansList: FC<LoansListProps> = ({ className }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const userLoans: LoanWithMetadata[] = useSelector(selectUserLoans);
  const loading: boolean = useSelector(selectUserLoansPending);

  return (
    <InfinityScroll
      itemsToShow={itemsToShow}
      isLoading={loading}
      next={next}
      wrapperClassName={classNames(styles.loansList, className)}
      emptyMessage="Loans not found"
    >
      {userLoans.map((loanWithMetadata, idx) => (
        <LoanCard key={idx} loanWithMetadata={loanWithMetadata} />
      ))}
    </InfinityScroll>
  );
};
