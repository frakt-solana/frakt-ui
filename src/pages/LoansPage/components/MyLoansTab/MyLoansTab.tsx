import { Loan } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../../components/Button';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import { Select } from '../../../../components/Select';
import { commonActions } from '../../../../state/common/actions';
import { selectUserLoans } from '../../../../state/loans/selectors';
import { LoansList } from '../../../WalletPage/components/LoansList';
import {
  FilterFormInputsNames,
  LoansSortValue,
  SORT_LOANS_TYPE_VALUES,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';
import styles from './MyLoansTab.module.scss';

export const MyLoansTab = (): JSX.Element => {
  const { connected } = useWallet();
  const userLoans: Loan[] = useSelector(selectUserLoans);

  const [selectedCollections, setSelectedCollections] = useState<
    LoansSortValue[]
  >([]);

  const { control, loans } = useLoansFiltering({
    selectedCollections,
  });

  const totalDebt = userLoans.reduce(
    (acc, { repayValue }) => acc + repayValue,
    0,
  );
  const totalBorrowed = userLoans.reduce(
    (acc, { loanValue }) => acc + loanValue,
    0,
  );

  const sortValueOption = userLoans.map(({ collectionName }) => {
    return [
      {
        label: <span className={styles.sortName}>{collectionName}</span>,
        value: collectionName,
      },
    ][0];
  });

  return (
    <div className={styles.wrapper}>
      {connected ? (
        <>
          <div className={styles.sortWrapper}>
            <div className={styles.content}>
              <div className={styles.valuesWrapper}>
                <p className={styles.value}>
                  Total borrowed: <span>{totalBorrowed.toFixed(2)} SOL</span>
                </p>
                <p className={styles.value}>
                  Total Debt: <span>{totalDebt.toFixed(2)} SOL</span>
                </p>
              </div>
            </div>
            <div className={styles.filters}>
              <Controller
                control={control}
                name={FilterFormInputsNames.LOANS_STATUS}
                render={({ field: { ref, ...field } }) => (
                  <Select
                    valueContainerClassName={styles.sortingSelectContainer}
                    className={styles.sortingSelect}
                    label="Loan Type"
                    name={FilterFormInputsNames.LOANS_STATUS}
                    options={SORT_LOANS_TYPE_VALUES}
                    {...field}
                  />
                )}
              />
              <CollectionDropdown
                options={sortValueOption}
                values={selectedCollections}
                setValues={(value) => setSelectedCollections(value)}
                className={styles.sortingSelect}
              />
              <Controller
                control={control}
                name={FilterFormInputsNames.SORT}
                render={({ field: { ref, ...field } }) => (
                  <Select
                    valueContainerClassName={styles.sortingSelectContainer}
                    className={styles.sortingSelect}
                    label="Sort by"
                    name={FilterFormInputsNames.SORT}
                    options={SORT_VALUES}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <LoansList loans={loans} />
        </>
      ) : (
        <ConnectWalletSection />
      )}
    </div>
  );
};

const ConnectWalletSection = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.connectWallet}>
      <p className={styles.connectWalletText}>
        Connect your wallet to check if you have any active loans
      </p>
      <Button
        type="alternative"
        className={styles.connectWalletBtn}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};
