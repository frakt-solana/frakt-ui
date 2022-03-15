import { FC } from 'react';
import classNames from 'classnames';

import { UserNFT } from '../../../../contexts/userTokens';
import styles from './Sidebar.module.scss';
import { useSidebar } from './hooks';
import { Slider } from '../Slider';

export interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  currentVaultPubkey?: string;
  nfts: UserNFT[];
  sidebarForm: JSX.Element;
}

const Sidebar: FC<SidebarProps> = ({
  onDeselect,
  currentVaultPubkey,
  nfts,
  sidebarForm,
}) => {
  const {
    isSidebarVisible,
    lockedNfts,
    isBasket,
    isHeaderHidden,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useSidebar(currentVaultPubkey, nfts);

  return (
    <>
      <div
        className={classNames([
          styles.sidebarWrapper,
          { [styles.visible]: isSidebarVisible },
          { [styles.collapsed]: isSidebarCollapsed },
          { [styles.headerHidden]: isHeaderHidden },
        ])}
      >
        <div className={styles.sidebar}>
          <p className={styles.nftsAmount} onClick={toggleSidebarCollapse}>
            Your NFT{isBasket && 's'} ({nfts.length + lockedNfts.length})
          </p>
          <Slider
            nfts={nfts}
            lockedNFT={lockedNfts}
            onDeselect={onDeselect}
            className={styles.slider}
          />
          <div className={styles.separator} />
          {isSidebarVisible && sidebarForm}
        </div>
      </div>
      <div
        className={classNames([
          styles.backDrop,
          {
            [styles.backDropVisible]: isSidebarVisible && !isSidebarCollapsed,
          },
        ])}
        onClick={toggleSidebarCollapse}
      />
    </>
  );
};

export default Sidebar;
