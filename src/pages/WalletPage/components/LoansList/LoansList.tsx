import { FC } from 'react';
import classNames from 'classnames';

import LoanCard from '../../../../components/LoanCard';
import styles from './LoansList.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';
import { LoanWithArweaveMetadata } from '../../../../contexts/loans';

interface LoansListProps {
  className?: string;
  loansWithArweaveMetadata?: LoanWithArweaveMetadata[];
  loading?: boolean;
}

export const LoansList: FC<LoansListProps> = ({
  className,
  loansWithArweaveMetadata = [],
  loading = false,
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  return (
    <FakeInfinityScroll
      itemsToShow={itemsToShow}
      isLoading={loading}
      next={next}
      wrapperClassName={classNames(styles.loansList, className)}
      emptyMessage="Loans not found"
    >
      {loansWithArweaveMetadata.map((loanWithArweaveMetadata, idx) => (
        <LoanCard key={idx} loanWithArweaveMetadata={loanWithArweaveMetadata} />
      ))}
    </FakeInfinityScroll>
  );
};
