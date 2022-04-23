import { FC } from 'react';
import classNames from 'classnames';

import { InventoryWalletInfo } from '../InventoryWalletInfo';
import { LiquidityWalletInfo } from '../LiquidityWalletInfo';
import styles from './GeneralWalletInfo.module.scss';

interface GeneralWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  lpToken: {
    ticker: string;
    balance: number;
  };
  onSellAndStakeInInventoryPool?: () => void;
  onSellAndStakeInLiquididtyPool?: () => void;
  onDepositLiquidity?: () => void;
  className?: string;
}

export const GeneralWalletInfo: FC<GeneralWalletInfoProps> = ({
  poolToken,
  lpToken,
  onSellAndStakeInInventoryPool,
  onSellAndStakeInLiquididtyPool,
  onDepositLiquidity,
  className,
}) => {
  const showInventoryWalletInfo =
    !!poolToken?.balance || !!onSellAndStakeInInventoryPool;
  const showLiquidityWalletInfo =
    !!lpToken?.balance ||
    !!poolToken?.balance ||
    !!onSellAndStakeInLiquididtyPool;

  return (
    <div className={classNames([styles.generalWalletInfo, className])}>
      {showInventoryWalletInfo && (
        <InventoryWalletInfo
          poolToken={poolToken}
          onSellNft={onSellAndStakeInInventoryPool}
          className={styles.inventoryWalletInfo}
        />
      )}
      {showLiquidityWalletInfo && (
        <LiquidityWalletInfo
          poolToken={poolToken}
          lpToken={lpToken}
          onDepositLiquidity={onDepositLiquidity}
          onSellNft={onSellAndStakeInLiquididtyPool}
          className={styles.liquidityWalletInfo}
        />
      )}
    </div>
  );
};
