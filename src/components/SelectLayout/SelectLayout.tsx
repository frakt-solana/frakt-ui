import { FC } from 'react';

import Sidebar from './components/Sidebar';
import { UserNFT } from '../../contexts/userTokens';
import { AppLayout } from '../Layout/AppLayout';
import styles from './SelectLayout.module.scss';
import { Container } from '../Layout';

interface SelectLayoutProps {
  selectedNfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
  currentVaultPubkey?: string;
  sidebarForm: JSX.Element;
  isCloseSidebar?: boolean;
}

export const SelectLayout: FC<SelectLayoutProps> = ({
  children,
  currentVaultPubkey,
  selectedNfts,
  onDeselect,
  sidebarForm,
  isCloseSidebar,
}) => {
  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        currentVaultPubkey={currentVaultPubkey}
        nfts={selectedNfts}
        onDeselect={onDeselect}
        sidebarForm={sidebarForm}
        isCloseSidebar={isCloseSidebar}
      />
      <Container component="main" className={styles.contentWrapper}>
        <div id="content-reducer" className={styles.contentReducer}>
          {children}
        </div>
      </Container>
    </AppLayout>
  );
};
