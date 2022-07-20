import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { AppLayout } from '../../components/Layout/AppLayout';
import { MyLoansTab } from './components/MyLoansTab';
import BorrowBanner from './components/BorrowBanner';
import { Container } from '../../components/Layout';
import LendingPool from './components/LendingPool';
import styles from './LoansPage.module.scss';
import { Tabs } from '../../components/Tabs';
import { Loader } from '../../components/Loader';
import { useLoansPage, LoanTabsNames } from './hooks';
import { SearchInput } from '../../components/SearchInput';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { Select } from '../../components/Select';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from './hooks/useLendingPoolsFiltering';
import Confetti from '../../components/Confetti';
import { useSelector } from 'react-redux';
import { selectConfettiVisible } from '../../state/common/selectors';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LoansPage: FC = () => {
  const { loanTabs, tabValue, setTabValue } = useLoansPage();
  const { control, setSearch, pools, showStakedOnlyToggle } =
    useLendingPoolsFiltering();

  const confettiVisible = useSelector(selectConfettiVisible);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <Confetti isVisible={confettiVisible} />
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
                onChange={(event) => setSearch(event.target.value || '')}
                className={styles.searchInput}
                placeholder="Search by pool name"
              />
              <div className={styles.filters}>
                {showStakedOnlyToggle && (
                  <ControlledToggle
                    control={control}
                    name={InputControlsNames.SHOW_STAKED}
                    label="Staked only"
                  />
                )}
                <Controller
                  control={control}
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
                />
              </div>
            </div>
            {pools ? (
              <div className={styles.sortWrapper}>
                {pools?.map((liquidityPool) => (
                  <LendingPool
                    key={liquidityPool.pubkey}
                    liquidityPool={liquidityPool}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.loader}>
                <Loader size={'large'} />
              </div>
            )}
          </>
        )}
        {tabValue === LoanTabsNames.LIQUIDATIONS && <div />}
        {tabValue === LoanTabsNames.LOANS && <MyLoansTab />}
      </Container>
    </AppLayout>
  );
};

export default LoansPage;
