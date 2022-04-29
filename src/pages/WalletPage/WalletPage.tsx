import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Tab, Tabs, useTabs } from '../../components/Tabs';
import { ProfileCard } from './components/ProfileCard';
import { Container } from '../../components/Layout';
import { VaultsTab } from './components/VaultsTab';
import { TokensTab } from './components/TokensTab';
import { LoansList } from './components/LoansList';
import styles from './WalletPage.module.scss';
import { useUserLoans } from '../../contexts/loans';

export interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

export enum WalletTabs {
  TOKENS = 'tokens',
  VAULTS = 'vaults',
  LOANS = 'loans',
}

const WalletPage: FC = () => {
  const {
    tabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: POOL_TABS,
    defaultValue: POOL_TABS[0].value,
  });

  const { userLoans, loading: userLoansLoading } = useUserLoans();

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>My profile</h2>
          </div>
        </div>
        <div className={styles.content}>
          <ProfileCard />
          <div className={styles.tabsContent}>
            <Tabs
              className={styles.tabs}
              tabs={tabs}
              value={tabValue}
              setValue={setTabValue}
            />
            {tabValue === WalletTabs.LOANS && (
              <LoansList
                className={styles.loansList}
                loans={userLoans}
                loading={userLoansLoading}
              />
            )}
            {tabValue === WalletTabs.TOKENS && <TokensTab />}
            {tabValue === WalletTabs.VAULTS && <VaultsTab />}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default WalletPage;

const POOL_TABS: Tab[] = [
  {
    label: 'Loans',
    value: 'loans',
  },
  {
    label: 'Tokens',
    value: 'tokens',
  },
  {
    label: 'Vaults',
    value: 'vaults',
  },
];
