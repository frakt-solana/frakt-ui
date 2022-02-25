import { NavLink } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { groupBy } from 'lodash';

import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import styles from './styles.module.scss';
import { createMarketPoolLink, MARKET_TABS } from '../../../../../constants';
import { SolanaIcon } from '../../../../../icons';
import { pluralize } from '../../../../../utils';

interface PoolCardProps {
  pool: NftPoolData;
}

const MOCK_TOKEN_NAME = 'TODO';

const MOCK_PRICE = 3.12;

export const PoolCard: FC<PoolCardProps> = ({ pool }) => {
  const { publicKey, safetyBoxes } = pool;

  const safetyBoxesByCollectionName = useMemo(() => {
    return groupBy(
      pool.safetyBoxes.filter(({ nftCollectionName }) => nftCollectionName),
      'nftCollectionName',
    );
  }, [pool]);

  const collectionsAmount =
    Object.keys(safetyBoxesByCollectionName)?.length || 0;

  const nftsAmount = safetyBoxes.length;

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  const tokenImage = '';

  const tokenName = MOCK_TOKEN_NAME;

  return (
    <NavLink
      to={createMarketPoolLink(MARKET_TABS.BUY, publicKey.toBase58())}
      className={styles.poolCardWrapper}
    >
      <div className={styles.poolCard}>
        <div className={styles.poolImgWrapper}>
          <img src={poolImage} alt="Pool card" className={styles.poolImage} />
          <div className={styles.poolShadow}>
            <p className={styles.poolInfoLabel}>
              {pluralize(collectionsAmount, 'collection')}
            </p>
            <p className={styles.poolInfoLabel}>
              {pluralize(nftsAmount, 'item')}
            </p>
          </div>
        </div>
        <div className={styles.cardContentWrapper}>
          <div className={styles.poolTokenInfo}>
            <div
              className={styles.tokenImage}
              style={{ backgroundImage: `url(${tokenImage})` }}
            />
            <p className={styles.tokenName}>{tokenName}</p>
          </div>
          <span className={styles.priceLabel}>price</span>
          <div className={styles.priceWrapper}>
            <span className={styles.poolPrice}>{MOCK_PRICE}</span>
            <SolanaIcon />
            <span className={styles.priceCurrency}>SOL</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};
