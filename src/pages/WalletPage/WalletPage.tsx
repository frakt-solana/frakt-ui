import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { AppLayout } from '../../components/Layout/AppLayout';
import { useWalletPage, WalletTabs } from './hooks';
import { Container } from '../../components/Layout';
import VaultCard from '../../components/VaultCard';
import { Loader } from '../../components/Loader';
import { ProfileCard } from './ProfileCard';
import { FRKT_TOKEN } from '../../utils';
import styles from './styles.module.scss';
import { PATHS } from '../../constants';
import { TokenCard } from './TokenCard';
import { LoansList } from './LoansList';

const WalletPage: FC = () => {
  const {
    onSwitchTab,
    tab,
    rawNfts,
    tokensLoading,
    userTokens,
    userVaults,
    nftsLoading,
    vaultsLoading,
  } = useWalletPage();

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
            {tab === WalletTabs.LOANS && (
              <>
                {nftsLoading ? (
                  <div className={styles.loader}>
                    <Loader size={'large'} />
                  </div>
                ) : (
                  <LoansList nfts={rawNfts} />
                )}
              </>
            )}
            {tab === WalletTabs.TOKENS && (
              <>
                {tokensLoading ? (
                  <div className={styles.loader}>
                    <Loader size={'large'} />
                  </div>
                ) : (
                  <div className={styles.tokens}>
                    {!userTokens.length && (
                      <p className={styles.emptyMessage}>No tokens found</p>
                    )}
                    {userTokens
                      .filter((token) => token.address !== FRKT_TOKEN.address)
                      .map((token) => (
                        <TokenCard key={token.address} token={token} />
                      ))}
                  </div>
                )}
              </>
            )}

            {tab === WalletTabs.VAULTS && (
              <>
                {vaultsLoading ? (
                  <div className={styles.loader}>
                    <Loader size={'large'} />
                  </div>
                ) : (
                  <>
                    <div className={styles.vaults}>
                      {!userVaults.length && (
                        <p className={styles.emptyMessage}>No vaults found</p>
                      )}
                      {userVaults.map((vault) => (
                        <NavLink
                          key={vault.vaultPubkey}
                          to={`${PATHS.VAULT}/${vault.vaultPubkey}`}
                        >
                          <VaultCard vaultData={vault} />
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default WalletPage;
