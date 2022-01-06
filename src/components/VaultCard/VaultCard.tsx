import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import Badge, {
  UnverifiedBadge,
  VAULT_BADGES_BY_STATE,
  VerifiedBadge,
} from '../Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString, shortBigNumber } from '../../utils';
import fraktionConfig from '../../contexts/fraktion/config';
import { useTokenMap } from '../../contexts/TokenList';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { Bid, VaultData, VaultState } from '../../contexts/fraktion';
import styles from './styles.module.scss';
import classNames from 'classnames';

export interface VaultCardProps {
  vaultData: VaultData;
}

export const VaultCard = ({ vaultData }: VaultCardProps): JSX.Element => {
  const tokenMap = useTokenMap();
  const { connection } = useConnection();
  const [vaultTitleData, setVaultTitleData] = useState<{
    name: string;
    symbol: string;
  }>({ name: '', symbol: '' });
  const [imageHoverIndex, setImageHoverIndex] = useState<number>(0);
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const currency =
    vaultData.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';
  const sortedSafetyBoxes = vaultData?.safetyBoxes.sort((a, b) => {
    return a.nftName.localeCompare(b.nftName);
  });

  useEffect(() => {
    setVaultTitleData({
      name: tokenMap.get(vaultData.fractionMint)?.name || '',
      symbol: tokenMap.get(vaultData.fractionMint)?.symbol || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap]);

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

  const noImg = !sortedSafetyBoxes.length;
  const image1 = sortedSafetyBoxes[0]?.nftImage;
  const image2 = sortedSafetyBoxes[1]?.nftImage;
  const image3 = sortedSafetyBoxes[2]?.nftImage;
  const numberOfNft =
    vaultData.safetyBoxes.length > 1
      ? `${vaultData.safetyBoxes.length} NFTs`
      : `${vaultData.safetyBoxes.length} NFT`;

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
                [styles.has1Img]: !!image1,
                [styles.has2Img]: !!image2,
                [styles.has3Img]: !!image3,
              },
            )}
          >
            <div
              style={{ backgroundImage: `url(${image1})` }}
              className={styles.vaultImage}
            />
            <div
              style={{ backgroundImage: `url(${image2})` }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(1)}
              onMouseLeave={onImageMouseLeave()}
            />
            <div
              style={{ backgroundImage: `url(${image3})` }}
              className={styles.vaultImage}
              onMouseEnter={onImageMouseEnter(2)}
              onMouseLeave={onImageMouseLeave()}
            />
          </div>
          <div className={styles.actions}>
            {sortedSafetyBoxes[0]?.isNftVerified ? (
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
            <Badge label={numberOfNft} className={styles.badge} />
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
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Total supply</div>
            <div className={styles.value}>
              {fractionsSupplyNum
                ? shortBigNumber(vaultData.fractionsSupply, 1, 3)
                : 'No value'}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>Fraktion price ({currency})</div>
            <div className={styles.value}>
              {lockedPricePerShareNum
                ? shortBigNumber(vaultData.lockedPricePerShare, 6, 6)
                : 'No value'}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>
              {vaultData.state === VaultState.Active &&
                `Start bid (${currency})`}
              {vaultData.state === VaultState.AuctionLive &&
                `Current bid (${currency})`}
              {(vaultData.state === VaultState.AuctionFinished ||
                vaultData.state === VaultState.Archived) &&
                `Winning bid (${currency})`}
            </div>
            <div className={styles.value}>
              {vaultData.state === VaultState.Active ? startBid : winBid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
