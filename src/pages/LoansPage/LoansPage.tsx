import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Controller } from 'react-hook-form';

import { ControlledToggle } from '../../components/Toggle/Toggle';
import { AppLayout } from '../../components/Layout/AppLayout';
import { LoansList } from '../WalletPage/components/LoansList';
import { SearchInput } from '../../components/SearchInput';
import { Container } from '../../components/Layout';
import BorrowBanner from './components/BorrowBanner';
import LendingPool from './components/LendingPool';
import { Select } from '../../components/Select';
import styles from './LoansPage.module.scss';
import { Tabs } from '../../components/Tabs';
import {
  InputControlsNames,
  LoanTabsNames,
  SORT_VALUES,
  useLoansPage,
} from './hooks';

const LoansPage: FC = () => {
  const { connected } = useWallet();
  const {
    loanTabs,
    tabValue,
    setTabValue,
    searchItems,
    formControl,
    userLoans,
    userLoansLoading,
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
              <div className={styles.filters}>
                {connected && (
                  <ControlledToggle
                    control={formControl}
                    name={InputControlsNames.SHOW_STAKED}
                    label="Staked only"
                    className={styles.filter}
                  />
                )}
                <Controller
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
                />
              </div>
            </div>
            <LendingPool
              totalSupply={'1500'}
              deposit={'5'}
              loans={'5'}
              apy={'30'}
            />
          </>
        )}
        {tabValue === LoanTabsNames.LIQUIDATIONS && <div />}
        {tabValue === LoanTabsNames.LOANS && (
          <div style={{ paddingTop: 20 }}>
            <LoansList loans={userLoans} loading={userLoansLoading} />
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default LoansPage;
