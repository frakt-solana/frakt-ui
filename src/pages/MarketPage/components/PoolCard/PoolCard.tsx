import { NavLink } from 'react-router-dom';
import { FC } from 'react';

import { NftPoolData } from '../../../../utils/cacher/nftPools';
import styles from './styles.module.scss';
import { PATHS } from '../../../../constants';
import { SolanaIcon } from '../../../../icons';

interface PoolCardProps {
  pool: NftPoolData;
}

const MOCK_IMAGE =
  'https://w55pcai3doppkjvizydkia7l3kkdl3rdexzt5rlduyukdfehs4yq.arweave.net/t3rxARsbnvUmqM4GpAPr2pQ17iMl8z7FY6YooZSHlzE';

const MOCK_TOKEN_NAME = 'FRKT';

const MOCK_PRICE = 3.12;

export const PoolCard: FC<PoolCardProps> = ({ pool }) => {
  const { publicKey, safetyBoxes } = pool;

  const collectionsAmount = 2;

  const nftsAmount = safetyBoxes.length;

  const poolImage = MOCK_IMAGE;

  const tokenImage = MOCK_IMAGE;

  const tokenName = MOCK_TOKEN_NAME;

  //TODO refactor routes
  return (
    <NavLink
      to={`${PATHS.MARKET}/${publicKey.toBase58()}/sell`}
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
