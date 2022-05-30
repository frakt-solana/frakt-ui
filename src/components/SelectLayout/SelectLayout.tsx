import { FC } from 'react';

import Sidebar from './components/Sidebar';
import { WhiteListedNFT } from '../../contexts/userTokens';
import { AppLayout } from '../Layout/AppLayout';
import styles from './SelectLayout.module.scss';
import { Container } from '../Layout';

interface SelectLayoutProps {
  selectedNfts: WhiteListedNFT[];
  onDeselect?: (nft: WhiteListedNFT) => void;
  sidebarForm: JSX.Element;
  isCloseSidebar?: boolean;
}

export const SelectLayout: FC<SelectLayoutProps> = ({
  children,
  selectedNfts,
  onDeselect,
  sidebarForm,
  isCloseSidebar,
}) => {
  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
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
