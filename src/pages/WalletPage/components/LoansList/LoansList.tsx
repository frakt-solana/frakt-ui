import { FC } from 'react';
import { LoanView } from '@frakters/nft-lending-v2';

import LoanCard from '../../../../components/LoanCard';
import styles from './LoansList.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';
import classNames from 'classnames';

interface LoansListProps {
  className?: string;
  loans?: LoanView[];
  loading?: boolean;
}

export const LoansList: FC<LoansListProps> = ({
  className,
  loans = [],
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
      {loans?.map((loan: LoanView) => (
        <LoanCard key={loan.loanPubkey} loan={loan} />
      ))}
    </FakeInfinityScroll>
  );
};
