import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';

import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import { DetailsForm } from './DetailsForm/DetailsForm';
import { useFraktion, VaultState } from '../../../contexts/fraktion';
import { AddNftsToActiveVault, FraktionalizeTxnData } from '../hooks';
import { DetailsFormDisabled } from './DetailsForm/DetailsFormDisabled';
import { useHeaderState } from '../../../components/Layout/headerState';
import { Slider } from './Slider';

interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  currentVaultPubkey: string;
  onContinueClick: (params: FraktionalizeTxnData) => Promise<void>;
  addNftsToActiveVault: AddNftsToActiveVault;
  nfts: UserNFT[];
}

const Sidebar = ({
  onDeselect,
  currentVaultPubkey,
  nfts,
  onContinueClick,
  addNftsToActiveVault,
}: SidebarProps): JSX.Element => {
  const { isHeaderHidden } = useHeaderState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isBasket = nfts.length > 1;

  const { vaults } = useFraktion();

  const currentVault = useMemo(
    () => vaults.find((el) => el.vaultPubkey === currentVaultPubkey),
    [currentVaultPubkey, vaults],
  );
  const lockedNfts = currentVault?.safetyBoxes || [];
  const isVaultActive = currentVault?.state === VaultState.Active;

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isSidebarVisible = !!(nfts.length || lockedNfts?.length);

  useEffect(() => {
    if (!nfts.length) {
      setIsSidebarCollapsed(false);
    }
  }, [nfts.length]);

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
          {isSidebarVisible &&
            (isVaultActive ? (
              <DetailsFormDisabled
                vaultData={currentVault}
                continueBtnDisabled={!nfts.length}
                onSubmit={() =>
                  addNftsToActiveVault({ vaultData: currentVault, nfts })
                }
              />
            ) : (
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
                  });
                }}
              />
            ))}
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
