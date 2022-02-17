import React, { FC, useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import Badge, {
  UnverifiedBadge,
  VAULT_BADGES_BY_STATE,
  VerifiedBadge,
} from '../Badge';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString, shortBigNumber } from '../../utils';
import fraktionConfig from '../../contexts/fraktion/config';
import { useTokensMap } from '../../contexts/TokenList';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import {
  Bid,
  useAuctionCountdown,
  VaultData,
  VaultState,
} from '../../contexts/fraktion';
import styles from './styles.module.scss';
import classNames from 'classnames';

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

  const auctionEndingTime = vaultData?.auction?.auction?.isStarted
    ? vaultData?.auction?.auction?.endingAt
    : 0;

  const { leftTime } = useAuctionCountdown(auctionEndingTime);

  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const currency =
    vaultData.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

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
          <div className={styles.stats}>
            <div className={styles.item}>
              <div className={styles.title}>
                TIME <br /> LEFT
              </div>
              <div className={styles.value}>
                {fractionsSupplyNum ? (
                  <div className={styles.countdown}>
                    <p className={styles.timeItem}>{leftTime.days}d</p>
                    <span className={styles.timeDelim}>:</span>
                    <p className={styles.timeItem}>{leftTime.hours}h</p>
                    <span className={styles.timeDelim}>:</span>
                    <p className={styles.timeItem}>{leftTime.minutes}m</p>
                    <span className={styles.timeDelim}>:</span>
                    <p className={styles.timeItem}>{leftTime.seconds}s</p>
                  </div>
                ) : (
                  'No value'
                )}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>LAST&nbsp;BID (SOL)</div>
              <div className={styles.value}>
                {lockedPricePerShareNum ? winBid : 'No value'}
              </div>
            </div>
          </div>
        ) : (
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
              <div className={styles.title}>
                Fraktion price&nbsp;({currency})
              </div>
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
        )}
      </div>
    </div>
  );
};

export default VaultCard;
