import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import { Controller } from 'react-hook-form';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import { LoansList } from '../../../WalletPage/components/LoansList';
import { Select } from '../../../../components/Select';
import {
  FilterFormInputsNames,
  LoansValue,
  SORT_LOANS_TYPE_VALUES,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';
import styles from './MyLoansTab.module.scss';

export const MyLoansTab: FC = () => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<LoansValue[]>(
    [],
  );

  const { control, loans, totalBorrowed, totalDebt, sortValueOption } =
    useLoansFiltering({
      selectedCollections,
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
              <div className={styles.filtersContent}>
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
              </div>
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
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
