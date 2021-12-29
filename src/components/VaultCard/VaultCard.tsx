import { useEffect, useState } from 'react';
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

const VaultCard = ({ vaultData }: VaultCardProps): JSX.Element => {
  const tokenMap = useTokenMap();
  const { connection } = useConnection();
  const [tokerName, setTokerName] = useState<string>('');
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const currency =
    vaultData.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  useEffect(() => {
    setTokerName(tokenMap.get(vaultData.fractionMint)?.symbol || '');
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

  const { nftName, nftImage, isNftVerified } =
    vaultData.safetyBoxes.length >= 1
      ? vaultData.safetyBoxes[0]
      : {
          nftName: '',
          nftImage: '',
          isNftVerified: false,
        };

  const fractionsSupplyNum = +decimalBNToString(vaultData.fractionsSupply);
  const lockedPricePerShareNum = +decimalBNToString(
    vaultData.lockedPricePerShare,
  );

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={classNames(styles.image, { [styles.noImg]: !nftImage })}
          style={{ backgroundImage: `url(${nftImage})` }}
        >
          <div className={styles.actions}>
            {isNftVerified ? <VerifiedBadge /> : <UnverifiedBadge />}
            <Badge
              label={VAULT_BADGES_BY_STATE[vaultData.state]}
              className={styles.badge}
            />
            {vaultData.hasMarket && (
              <Badge label="Tradable" className={styles.badge} />
            )}
          </div>
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>
            {nftName} {tokerName ? `($${tokerName})` : ''}
          </div>
          <div className={styles.owner}>
            <img
              className={styles.owner__avatar}
              src={getOwnerAvatar(nameServiceInfo.twitterHandle)}
              alt="Owner avatar"
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
