import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { selectUserLoans } from '../../../state/loans/selectors';
import { compareNumbers } from '../../../contexts/liquidityPools';
import { ArrowDownSmallIcon } from '../../../icons';
import { Loan } from '../../../state/loans/types';
import styles from '../components/MyLoansTab/MyLoansTab.module.scss';
import { useDebounce } from '../../../hooks';
import { caclTimeToRepay } from '../../../utils/loans';

type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: LoansSortValue;
};

type LoansSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

enum SortField {
  DEBT = 'debt',
  TIME_TO_REPAY = 'timeToRepay',
  HEALTH = 'health',
  CREATION = 'creation',
}

type UseLoansFiltering = () => {
  control: Control<FilterFormFieldsValues>;
  loans: Loan[];
  setSearch: (value?: string) => void;
};

export const useLoansFiltering: UseLoansFiltering = () => {
  const userLoans: Loan[] = useSelector(selectUserLoans);

  const { connected } = useWallet();

  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string): void => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);

  const filteredLoans = useMemo(() => {
    if (userLoans?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return userLoans
        .filter((loan) => {
          const nftName = loan.name;

          return nftName.toUpperCase().includes(searchString);
        })
        .sort((loanA, loanB) => {
          if (sortField === SortField.DEBT) {
            return compareNumbers(
              loanA.repayValue,
              loanB.repayValue,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.TIME_TO_REPAY) {
            if (loanA.isPriceBased) return;

            const { loanDurationInSeconds: timeToRepayA } =
              caclTimeToRepay(loanA);
            const { loanDurationInSeconds: timeToRepayB } =
              caclTimeToRepay(loanB);

            return compareNumbers(
              timeToRepayA,
              timeToRepayB,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.HEALTH) {
            if (!loanA.isPriceBased) return;

            return compareNumbers(
              loanA.health,
              loanB.health,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.CREATION) {
            const creationTimeA = moment(loanA.startedAt).unix();
            const creationTimeB = moment(loanB.startedAt).unix();

            return compareNumbers(
              creationTimeA,
              creationTimeB,
              sortOrder === 'asc',
            );
          }
          return 0;
        });
    }
    return [];
  }, [userLoans, sort, searchString]);

  return {
    control,
    loans: filteredLoans,
    setSearch: searchDebounced,
    showStakedOnlyToggle: connected,
  };
};

export const SORT_VALUES: LoansSortValue[] = [
  {
    label: (
      <span className={styles.sortName}>
        Creation <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'creation_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Creation <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'creation_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Dept
        <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'Dept_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Dept
        <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'Dept_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Time to repay <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'timeToRepay_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Time to repay <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'timeToRepay_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Health <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'health_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Health <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'health_desc',
  },
];
