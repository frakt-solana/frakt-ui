import { FC } from 'react';

import styles from './HeaderBuy.module.scss';
import { QuestionIcon } from '../../../../../icons';
import { BuyRandomNftForm } from './BuyRandomNftForm';
import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import { useNftPoolTokenBalance } from '../../../hooks';

import { MarketHeaderInner } from '../../../components/MarketHeaderInner';

interface HeaderBuyProps {
  pool: NftPoolData;
  onBuy: () => void;
}

export const HeaderBuy: FC<HeaderBuyProps> = ({ pool, onBuy }) => {
  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  return (
    <MarketHeaderInner poolPublicKey={pool.publicKey.toBase58()}>
      <div className={styles.randomWrapper}>
        <div className={styles.questionWrapper}>
          <img
            src={poolImage}
            alt="Pool image"
            className={styles.poolBgImage}
          />
          <QuestionIcon className={styles.questionIcon} />
        </div>
        <BuyRandomNftForm
          poolTokenAvailable={poolTokenAvailable}
          onBuy={onBuy}
        />
      </div>
    </MarketHeaderInner>
  );
};
