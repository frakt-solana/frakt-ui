import { FC } from 'react';
import classNames from 'classnames';

import styles from './HeaderBuy.module.scss';
import { QuestionIcon } from '../../../../../icons';
import { BuyRandomNft } from './BuyRandomNft';
import { MarketNavigation } from '../../../components/MarketNavigation';
import { useHeaderState } from '../../../../../components/Layout/headerState';
import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';

interface HeaderBuyProps {
  pool: NftPoolData;
  poolPublicKey: string;
  onBuy: () => void;
}

export const HeaderBuy: FC<HeaderBuyProps> = ({
  pool,
  poolPublicKey,
  onBuy,
}) => {
  const { isHeaderHidden } = useHeaderState();

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  return (
    <div
      className={classNames({
        [styles.positionWrapper]: true,
        [styles.headerHidden]: isHeaderHidden,
      })}
    >
      <div className={`container ${styles.container}`}>
        <div className={styles.wrapper}>
          <div className={styles.randomWrapper}>
            <div className={styles.questionWrapper}>
              <img
                src={poolImage}
                alt="Pool image"
                className={styles.poolBgImage}
              />
              <QuestionIcon className={styles.questionIcon} />
            </div>
            <BuyRandomNft onBuy={onBuy} />
            <MarketNavigation
              className={styles.marketNavigation}
              poolPublicKey={poolPublicKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
