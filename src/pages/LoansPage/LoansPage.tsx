import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import { MyLoansTab } from './components/MyLoansTab';
import BorrowBanner from './components/BorrowBanner';
import { Container } from '../../components/Layout';
import LendingPool from './components/LendingPool';
import styles from './LoansPage.module.scss';
import { Tabs } from '../../components/Tabs';
import { LoanTabsNames, useLoansPage } from './hooks';

const LoansPage: FC = () => {
  const {
    loanTabs,
    tabValue,
    setTabValue,
    searchItems,
    userLoans,
    userLoansLoading,
    loansPoolData,
  } = useLoansPage();

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Loans</h1>
            <h2 className={styles.subtitle}>
              Borrow and lend money, liquidate loans
            </h2>
          </div>
          <BorrowBanner />
        </div>
        <Tabs tabs={loanTabs} value={tabValue} setValue={setTabValue} />
        {tabValue === LoanTabsNames.LENDING && (
          <>
            <div className={styles.sortWrapper}>
              <SearchInput
                onChange={(e) => searchItems(e.target.value || '')}
                className={styles.search}
                placeholder="Filter by symbol"
              />
              {/* <Controller
                control={formControl}
                name={InputControlsNames.SORT}
                render={({ field: { ref, ...field } }) => (
                  <Select
                    valueContainerClassName={styles.sortingSelectContainer}
                    className={styles.sortingSelect}
                    label="Sort by"
                    name={InputControlsNames.SORT}
                    options={SORT_VALUES}
                    {...field}
                  />
                )}
              /> */}
            </div>
            {!!loansPoolData?.apr && (
              <LendingPool loansPoolData={loansPoolData} />
            )}
          </>
        )}
        {tabValue === LoanTabsNames.LIQUIDATIONS && <div />}
        {tabValue === LoanTabsNames.LOANS && (
          <MyLoansTab userLoans={userLoans} loading={userLoansLoading} />
        )}
      </Container>
    </AppLayout>
  );
};

export default LoansPage;
