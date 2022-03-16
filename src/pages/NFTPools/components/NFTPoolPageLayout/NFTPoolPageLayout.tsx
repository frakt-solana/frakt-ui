import { FC } from 'react';
import { Container } from '../../../../components/Layout';

import { AppLayout } from '../../../../components/Layout/AppLayout';
import styles from './NFTPoolPageLayout.module.scss';

interface NFTPoolPageLayout {
  CustomHeader?: FC;
  children: JSX.Element[] | JSX.Element;
}

export const NFTPoolPageLayout: FC<NFTPoolPageLayout> = ({
  CustomHeader,
  children,
}) => {
  return (
    <AppLayout CustomHeader={CustomHeader}>
      <Container component="main" className={styles.content}>
        {children}
      </Container>
    </AppLayout>
  );
};
