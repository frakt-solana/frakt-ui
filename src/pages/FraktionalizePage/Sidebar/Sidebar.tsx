import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import { Header } from './Header';
import { DetailsForm } from './DetailsForm/DetailsForm';
import { useFraktion, VaultData } from '../../../contexts/fraktion';
import { useParams, useHistory } from 'react-router';
import { URLS } from '../../../constants';

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
    currentVault?: VaultData,
  ) => Promise<void>;
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

  const { vaults } = useFraktion();
  const { vaultPubkey: currentVaultPubkey } =
    useParams<{ vaultPubkey: string }>();
  const history = useHistory();

  const currentVault = useMemo(
    () => vaults.find((el) => el.vaultPubkey === currentVaultPubkey),
    [currentVaultPubkey, vaults],
  );
  const lockedNFT = currentVault?.safetyBoxes || [];

  const changeSidebarVisibility = () => {
    setIsMobileSidebar(!isMobileSidebar);
  };

  const isSidebarClosed = !nfts.length && !lockedNFT?.length;

  useEffect(() => {
    if (!nfts.length) {
      setIsMobileSidebar(false);
    }
  }, [nfts.length]);

  return (
    <div
      className={classNames([
        styles.sidebarWrapper,
        { [styles.visible]: !isSidebarClosed },
        { [styles.mobileSidebar]: isMobileSidebar },
      ])}
    >
      {!!(nfts.length + lockedNFT.length) && (
        <div
          className={styles.selectedVaults}
          onClick={changeSidebarVisibility}
        >
          <p>
            Your NFT{isBasket && 's'} ({nfts.length + lockedNFT.length})
          </p>
        </div>
      )}
      <div className={styles.sidebar}>
        <Header
          lockedNFT={lockedNFT}
          isBasket={isBasket}
          nfts={nfts}
          onDeselect={onDeselect}
        />
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
        {!isSidebarClosed && (
          <DetailsForm
            vaultName={nfts[0]?.metadata?.name}
            isAuction={isAuction}
            onSubmit={({
              ticker,
              pricePerFraktion,
              buyoutPrice, // eslint-disable-line
              supply,
              basketName,
              tickSize,
              startBid,
            }) =>
              onContinueClick(
                nfts,
                ticker,
                pricePerFraktion,
                Number(supply),
                basketName,
                Number(tickSize),
                Number(startBid),
                isAuction,
                currentVault,
              ).then(() => {
                history.push(URLS.FRAKTIONALIZE);
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
