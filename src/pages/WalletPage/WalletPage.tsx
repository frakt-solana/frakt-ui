import { FC, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import BN from 'bn.js';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import { ProfileCard } from './components/ProfileCard';
import styles from './styles.module.scss';
import { VaultsTab } from './components/VaultsTab';
import { LoansTab } from './components/LoansTab';
import { TokensTab } from './components/TokensTab';

export interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

export enum WalletTabs {
  TOKENS = 'tokens',
  VAULTS = 'vaults',
  LOANS = 'loans',
}

const WalletPage: FC = () => {
  const [tab, setTab] = useState<WalletTabs>(WalletTabs.TOKENS);

  const onSwitchTab = (event: any) => {
    setTab(event.target.name);
  };

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
            <div className={styles.tabs}>
              <button
                className={classNames([
                  styles.tab,
                  { [styles.tabActive]: tab === WalletTabs.LOANS },
                ])}
                name={WalletTabs.LOANS}
                onClick={onSwitchTab}
              >
                Loans
              </button>
              <button
                className={classNames([
                  styles.tab,
                  { [styles.tabActive]: tab === WalletTabs.TOKENS },
                ])}
                name={WalletTabs.TOKENS}
                onClick={onSwitchTab}
              >
                Tokens
              </button>
              <button
                className={classNames([
                  styles.tab,
                  { [styles.tabActive]: tab === WalletTabs.VAULTS },
                ])}
                name={WalletTabs.VAULTS}
                onClick={onSwitchTab}
              >
                Vaults
              </button>
            </div>
            {tab === WalletTabs.LOANS && <LoansTab />}
            {tab === WalletTabs.TOKENS && <TokensTab />}
            {tab === WalletTabs.VAULTS && <VaultsTab />}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default WalletPage;
