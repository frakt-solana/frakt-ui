import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import { Header } from './Header';
import { DetailsForm } from './DetailsForm/DetailsForm';

interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  onContinueClick: (
    userNfts: UserNFT[],
    tickerName: string,
    pricePerFraction: number,
    fractionsAmount: number,
    basketName?: string,
  ) => void;
  nfts: UserNFT[];
}

const Sidebar = ({ onDeselect, nfts }: SidebarProps): JSX.Element => {
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);

  const changeSidebarVisibility = () => {
    setIsMobileSidebar(!isMobileSidebar);
  };

  useEffect(() => {
    if (!nfts.length) {
      setIsMobileSidebar(false);
    }
  }, [nfts.length]);

  return (
    <div
      className={classNames([
        styles.sidebarWrapper,
        { [styles.visible]: !!nfts.length },
        { [styles.mobileSidebar]: isMobileSidebar },
      ])}
    >
      {/* TODO create separate component */}
      {!!nfts.length && (
        <div
          className={styles.selectedVaults}
          onClick={changeSidebarVisibility}
        >
          <p>
            {nfts.length > 1
              ? `Your NFTs (${nfts.length})`
              : `Your NFT (${nfts.length})`}
          </p>
        </div>
      )}
      <div className={styles.sidebar}>
        <Header nfts={nfts} onDeselect={onDeselect} />
        <DetailsForm
          nfts={nfts}
          onSubmit={(data) => {
            console.log(data);
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
