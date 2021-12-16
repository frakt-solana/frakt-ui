import React from 'react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';

const CollectionPage = (): JSX.Element => {
  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div></div>
      </Container>
    </AppLayout>
  );
};

export default CollectionPage;
