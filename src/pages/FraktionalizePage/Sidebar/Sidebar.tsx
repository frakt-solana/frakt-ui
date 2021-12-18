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
    tickSize?: number,
    startBid?: number,
    isAuction?: boolean,
  ) => void;
  nfts: UserNFT[];
}

const Sidebar = ({
  onDeselect,
  nfts,
  onContinueClick,
}: SidebarProps): JSX.Element => {
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const isBasket = nfts.length > 1;
  const [isAuction] = useState<boolean>(false);

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
      {!!nfts.length && (
        <div
          className={styles.selectedVaults}
          onClick={changeSidebarVisibility}
        >
          <p>
            Your NFT{isBasket && 's'} ({nfts.length})
          </p>
        </div>
      )}
      <div className={styles.sidebar}>
        <Header isBasket={isBasket} nfts={nfts} onDeselect={onDeselect} />
        {/*
            <div className={styles.toggle_wrapper}>
              <div className={styles.separator} />
              <div className={styles.toggle}>
                Instant buyout
                <Toggle value={!isAuction} onChange={() => setIsAuction(val => !val)} />
              </div>
              <div className={styles.separator} />
            </div>
           */}
        <div className={styles.toggle_wrapper}>
          <div className={styles.separator} />
        </div>
        <DetailsForm
          vaultName={nfts[0]?.metadata?.name}
          isBasket={isBasket}
          isAuction={isAuction}
          onSubmit={({
            ticker,
            pricePerFraktion,
            buyoutPrice,
            supply,
            basketName,
            tickSize,
            startBid,
          }) =>
            onContinueClick(
              nfts,
              ticker,
              pricePerFraktion,
              Number(buyoutPrice) / Number(supply),
              basketName,
              Number(tickSize),
              Number(startBid),
              isAuction, // TODO BN ?
            )
          }
        />
      </div>
    </div>
  );
};

export default Sidebar;
