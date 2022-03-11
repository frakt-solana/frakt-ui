import { FC } from 'react';

import Sidebar from '../../pages/FraktionalizePage/Sidebar';
import { UserNFT } from '../../contexts/userTokens';
import { AppLayout } from '../Layout/AppLayout';
import styles from './styles.module.scss';
import { Container } from '../Layout';

interface SelectLayoutProps {
  selectedNfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  currentVaultPubkey: string;
  sidebarForm: JSX.Element;
}

export const SelectLayout: FC<SelectLayoutProps> = ({
  children,
  currentVaultPubkey,
  selectedNfts,
  onDeselect,
  sidebarForm,
}) => {
  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        currentVaultPubkey={currentVaultPubkey}
        nfts={selectedNfts}
        onDeselect={onDeselect}
      >
        {sidebarForm}
      </Sidebar>
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          {children}
        </div>
      </Container>
    </AppLayout>
  );
};
