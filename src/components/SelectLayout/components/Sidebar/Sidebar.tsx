import { FC } from 'react';
import classNames from 'classnames';

import { UserNFT } from '../../../../contexts/userTokens';
import styles from './Sidebar.module.scss';
import { useSidebar } from './hooks';
import { Slider } from '../Slider';

export interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  nfts: UserNFT[];
  sidebarForm: JSX.Element;
  isCloseSidebar: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  onDeselect,
  nfts,
  sidebarForm,
  isCloseSidebar = false,
}) => {
  const {
    isSidebarVisible,
    isHeaderHidden,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useSidebar(nfts);

  return (
    <>
      {!isCloseSidebar && (
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
                Your NFT
              </p>
              <Slider nfts={nfts} onDeselect={onDeselect} />
              <div className={styles.separator} />
              {isSidebarVisible && sidebarForm}
            </div>
          </div>
          <div
            className={classNames([
              styles.backDrop,
              {
                [styles.backDropVisible]:
                  isSidebarVisible && !isSidebarCollapsed,
              },
            ])}
            onClick={toggleSidebarCollapse}
          />
        </>
      )}
    </>
  );
};

export default Sidebar;
