import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import { Header } from './Header';
import { DetailsForm } from './DetailsForm/DetailsForm';
import { useFraktion } from '../../../contexts/fraktion';
import { useHistory } from 'react-router';
import { URLS } from '../../../constants';
import { FraktionalizeTxnData } from '../hooks';

interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  currentVaultPubkey: string;
  onContinueClick: (params: FraktionalizeTxnData) => Promise<void>;
  nfts: UserNFT[];
}

const Sidebar = ({
  onDeselect,
  currentVaultPubkey,
  nfts,
  onContinueClick,
}: SidebarProps): JSX.Element => {
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const isBasket = nfts.length > 1;

  const { vaults } = useFraktion();
  const history = useHistory();

  const currentVault = useMemo(
    () => vaults.find((el) => el.vaultPubkey === currentVaultPubkey),
    [currentVaultPubkey, vaults],
  );
  const lockedNfts = currentVault?.safetyBoxes || [];

  const changeSidebarVisibility = () => {
    setIsMobileSidebar(!isMobileSidebar);
  };

  const isSidebarClosed = !nfts.length && !lockedNfts?.length;

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
      <div className={styles.overflow} onClick={changeSidebarVisibility} />
      {!!(nfts.length + lockedNfts.length) && (
        <div
          className={styles.selectedVaults}
          onClick={changeSidebarVisibility}
        >
          <p>
            Your NFT{isBasket && 's'} ({nfts.length + lockedNfts.length})
          </p>
        </div>
      )}
      <div className={styles.sidebar}>
        <Header
          lockedNFT={lockedNfts}
          isBasket={isBasket}
          nfts={nfts}
          onDeselect={onDeselect}
        />
        <div className={styles.toggle_wrapper}>
          <div className={styles.separator} />
        </div>
        {!isSidebarClosed && (
          <DetailsForm
            onSubmit={({ ticker, pricePerFraktion, supply, vaultName }) => {
              const transformedLockedNfts: UserNFT[] = lockedNfts.map(
                ({
                  nftImage,
                  nftAttributes,
                  nftMint,
                  nftDescription,
                  nftName,
                }) => {
                  return {
                    mint: nftMint,
                    metadata: {
                      name: nftName,
                      symbol: '',
                      description: nftDescription,
                      image: nftImage,
                      animation_url: '',
                      external_url: '',
                      attributes: nftAttributes,
                      properties: null,
                    },
                  } as UserNFT;
                },
              );

              onContinueClick({
                newNfts: nfts,
                lockedNfts: transformedLockedNfts,
                tickerName: ticker,
                pricePerFraction: pricePerFraktion,
                fractionsAmount: Number(supply),
                vaultName,
                vault: currentVault,
              }).then(() => {
                history.push(URLS.FRAKTIONALIZE);
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
