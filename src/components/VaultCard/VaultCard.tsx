import React, { FC, useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import Badge, {
  UnverifiedBadge,
  VAULT_BADGES_BY_STATE,
  VerifiedBadge,
} from '../Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString, shortBigNumber } from '../../utils';
import { useTokensMap } from '../../contexts/TokenList';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { Bid, VaultData } from '../../contexts/fraktion';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { MainInfo } from './MainInfo';
import { AuctionInfo } from './AuctionInfo';

export interface VaultCardProps {
  vaultData: VaultData;
  isAuction?: boolean;
}

export const VaultCard: FC<VaultCardProps> = ({ vaultData, isAuction }) => {
  const tokensMap = useTokensMap();
  const { connection } = useConnection();
  const [vaultTitleData, setVaultTitleData] = useState<{
    name: string;
    symbol: string;
  }>({ name: '', symbol: '' });
  const [imageHoverIndex, setImageHoverIndex] = useState<number>(0);

  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  const safetyBoxes = vaultData?.safetyBoxes || [];

  useEffect(() => {
    setVaultTitleData({
      name: tokensMap.get(vaultData.fractionMint)?.name || '',
      symbol: tokensMap.get(vaultData.fractionMint)?.symbol || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensMap]);

  useEffect(() => {
    vaultData.authority && getNameServiceInfo(vaultData.authority, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData.authority]);

  const startBid = shortBigNumber(
    vaultData.lockedPricePerShare.mul(vaultData.fractionsSupply),
  );
  const winningBidInformation = vaultData.auction?.bids.find(
    (bid: Bid) =>
      bid?.bidPubkey === vaultData.auction.auction.currentWinningBidPubkey,
  );

  const winBid = winningBidInformation
    ? shortBigNumber(
        winningBidInformation.bidAmountPerShare.mul(vaultData.fractionsSupply),
      )
    : null;

  const noImg = !safetyBoxes.length;
  const numberOfNftText = safetyBoxes.length > 1 ? 'NFTs' : 'NFT';

  const fractionsSupplyNum = +decimalBNToString(vaultData.fractionsSupply);
  const lockedPricePerShareNum = +decimalBNToString(
    vaultData.lockedPricePerShare,
  );

  const onImageMouseEnter = (imageNumberIndex) => () => {
    setImageHoverIndex(imageNumberIndex);
  };
  const onImageMouseLeave = () => () => {
    setImageHoverIndex(0);
  };
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.mainAppearance}>
          <div
            className={classNames(
              styles.imageWrapper,
              styles[`imageHovered${imageHoverIndex}`],
              {
                [styles.noImg]: noImg,
                [styles.has1Img]: !!safetyBoxes[0]?.nftImage,
                [styles.has2Img]: !!safetyBoxes[1]?.nftImage,
                [styles.has3Img]: !!safetyBoxes[2]?.nftImage,
              },
            )}
          >
            <div
              style={{
                backgroundImage: `url(${safetyBoxes[0]?.nftImage})`,
              }}
              className={styles.vaultImage}
            />
            <div
              style={{
                backgroundImage: `url(${safetyBoxes[1]?.nftImage})`,
              }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(1)}
              onMouseLeave={onImageMouseLeave()}
            />
            <div
              style={{
                backgroundImage: `url(${safetyBoxes[2]?.nftImage})`,
              }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(2)}
              onMouseLeave={onImageMouseLeave()}
            />
          </div>
          <div className={styles.actions}>
            {vaultData?.isVerified && !!vaultData.safetyBoxes.length ? (
              <VerifiedBadge />
            ) : (
              <UnverifiedBadge />
            )}
            <Badge
              label={VAULT_BADGES_BY_STATE[vaultData.state]}
              className={styles.badge}
            />
            {vaultData.hasMarket && (
              <Badge label="Tradable" className={styles.badge} />
            )}
            <Badge
              label={`${vaultData.safetyBoxes.length} ${numberOfNftText}`}
              className={styles.badge}
            />
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {vaultData.safetyBoxes.length === 1
              ? vaultData.safetyBoxes[0]?.nftName
              : vaultTitleData?.name || `Vault #${vaultData.createdAt}`}{' '}
            {vaultTitleData.symbol && `($${vaultTitleData.symbol})`}
          </div>
          <div className={styles.owner}>
            <img
              className={styles.owner__avatar}
              src={getOwnerAvatar(nameServiceInfo.twitterHandle)}
            />
            {nameServiceInfo.domain || shortenAddress(vaultData.authority)}
          </div>
        </div>
        {isAuction ? (
          <AuctionInfo
            vaultData={vaultData}
            fractionsSupplyNum={fractionsSupplyNum}
            lockedPricePerShareNum={lockedPricePerShareNum}
            winBid={winBid}
          />
        ) : (
          <MainInfo
            vaultData={vaultData}
            fractionsSupplyNum={fractionsSupplyNum}
            lockedPricePerShareNum={lockedPricePerShareNum}
            startBid={startBid}
            winBid={winBid}
          />
        )}
      </div>
    </div>
  );
};

export default VaultCard;
