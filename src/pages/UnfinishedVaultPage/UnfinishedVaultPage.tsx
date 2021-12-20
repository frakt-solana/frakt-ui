import React from 'react';
import styles from './styles.module.scss';
import { AppLayout } from '../../components/Layout/AppLayout';
import NavigationLink from '../../components/Header/NavigationLink';
import { URLS } from '../../constants';
import { Container } from '../../components/Layout';

export const UnfinishedVaultPage = () => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Unfinished vault</h1>
          <ul className={styles.buttons}>
            <li className={styles.btnItem}>
              <NavigationLink
                to={`${URLS.CONTINUE_FRAKTIONALIZE}/{vaultPubkey}`}
              >
                Add NFTs and launch vault
              </NavigationLink>
            </li>
            <li className={styles.btnItem}>
              <button className={styles.launchVault}>Launch vault</button>
            </li>
          </ul>
        </div>
      </Container>
    </AppLayout>
  );
};
