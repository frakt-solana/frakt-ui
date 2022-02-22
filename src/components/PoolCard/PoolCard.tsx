import { NavLink } from 'react-router-dom';
import { FC } from 'react';

import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../utils/cacher/nftPools';
import styles from './styles.module.scss';
import { PATHS } from '../../constants';
import { SolanaIcon } from '../../icons';

interface PoolCardProps {
  pool: NftPoolData;
}

const MOCK_TOKEN_NAME = 'TODO';

const MOCK_PRICE = 3.12;

export const PoolCard: FC<PoolCardProps> = ({ pool }) => {
  const { publicKey, safetyBoxes } = pool;

  const collectionsAmount = 'X';

  const nftsAmount = safetyBoxes.length;

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  const tokenImage = '';

  const tokenName = MOCK_TOKEN_NAME;

  //TODO refactor routes
  return (
    <NavLink
      to={`${PATHS.MARKET}/${publicKey.toBase58()}/buy`}
      className={styles.poolCard}
    >
      <div className={styles.poolImgWrapper}>
        <img src={poolImage} alt="Pool card" className={styles.poolImage} />
        <div className={styles.poolShadow}>
          <p className={styles.poolInfoLabel}>
            {collectionsAmount} collections
          </p>
          <p className={styles.poolInfoLabel}>{nftsAmount} items</p>
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
    </NavLink>
  );
};
