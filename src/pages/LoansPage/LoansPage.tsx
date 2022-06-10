import { FC } from 'react';
import { useSelector } from 'react-redux';

import { AppLayout } from '../../components/Layout/AppLayout';
import { MyLoansTab } from './components/MyLoansTab';
import BorrowBanner from './components/BorrowBanner';
import { Container } from '../../components/Layout';
import LendingPool from './components/LendingPool';
import styles from './LoansPage.module.scss';
import { Tabs } from '../../components/Tabs';
import { LoanTabsNames, useLoansPage } from './hooks';
import { Loader } from '../../components/Loader';
import { selectLiquidityPoolInfo } from '../../state/loans/selectors';

const LoansPage: FC = () => {
  const { loanTabs, tabValue, setTabValue } = useLoansPage();
  const loansPoolInfo = useSelector(selectLiquidityPoolInfo);

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
            {loansPoolInfo?.apr ? (
              <div className={styles.sortWrapper}>
                <LendingPool loansPoolInfo={loansPoolInfo} />
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
