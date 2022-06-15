import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Tab, Tabs, useTabs } from '../../components/Tabs';
import { ProfileCard } from './components/ProfileCard';
import { Container } from '../../components/Layout';
import { TokensTab } from './components/TokensTab';
import { LoansList } from './components/LoansList';
import styles from './WalletPage.module.scss';
import { useParams } from 'react-router-dom';
import { usePublicKeyParam } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNameService, useWalletTokens } from './hooks';
import { shortenAddress } from '../../utils/solanaUtils';

export enum WalletTabs {
  TOKENS = 'tokens',
  VAULTS = 'vaults',
  LOANS = 'loans',
}

const useWalletPage = () => {
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  usePublicKeyParam(walletPubkey);

  const wallet = useWallet();

  const { nameServiceInfo } = useNameService({ walletPubkey });

  const isMyProfile = walletPubkey === wallet.publicKey?.toBase58();

  const { userTokens, loading: userTokensLoading } = useWalletTokens({
    walletPubkey,
  });

  const {
    tabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: isMyProfile ? POOL_TABS_MY : POOL_TABS,
    defaultValue: (isMyProfile ? POOL_TABS_MY : POOL_TABS)[0].value,
  });

  const pageTitle = isMyProfile
    ? 'My profile'
    : `${shortenAddress(walletPubkey)} profile`;

  return {
    tabs,
    tabValue,
    setTabValue,
    isMyProfile,
    pageTitle,
    userTokens,
    userTokensLoading,
    nameServiceInfo,
    walletPubkey,
  };
};

const WalletPage: FC = () => {
  const {
    tabs,
    tabValue,
    setTabValue,
    pageTitle,
    userTokens,
    userTokensLoading,
    nameServiceInfo,
    walletPubkey,
  } = useWalletPage();

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{pageTitle}</h2>
          </div>
        </div>
        <div className={styles.content}>
          <ProfileCard
            walletPubkey={walletPubkey}
            name={nameServiceInfo?.domain}
            twitterName={nameServiceInfo?.twitterHandle}
          />
          <div className={styles.tabsContent}>
            <Tabs
              className={styles.tabs}
              tabs={tabs}
              value={tabValue}
              setValue={setTabValue}
            />
            {tabValue === WalletTabs.LOANS && (
              <LoansList className={styles.loansList} />
            )}
            {tabValue === WalletTabs.TOKENS && (
              <TokensTab userTokens={userTokens} loading={userTokensLoading} />
            )}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default WalletPage;

const POOL_TABS: Tab[] = [
  {
    label: 'Tokens',
    value: 'tokens',
  },
];

const POOL_TABS_MY: Tab[] = [
  {
    label: 'Loans',
    value: 'loans',
  },
  ...POOL_TABS,
];
