import { FC } from 'react';
import classNames from 'classnames';

import { InventoryWalletInfo } from '../InventoryWalletInfo';
import { LiquidityWalletInfo } from '../LiquidityWalletInfo';
import { UserNFT } from '../../../../../contexts/userTokens';
import styles from './GeneralWalletInfo.module.scss';
import { CONTROLS } from '../../constants';

interface GeneralWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  lpToken: {
    ticker: string;
    balance: number;
  };
  userNfts: UserNFT[];
  onStakeInInventory?: () => void;
  onSellAndStakeInInventoryPool?: () => void;
  onSellAndStakeInLiquididtyPool?: () => void;
  onDepositLiquidity?: () => void;
  onStakeLp?: () => void;
  onWithdrawLp?: () => void;
  activeControl?: CONTROLS;
  className?: string;
}

export const GeneralWalletInfo: FC<GeneralWalletInfoProps> = ({
  poolToken,
  lpToken,
  userNfts,
  onStakeInInventory,
  onSellAndStakeInInventoryPool,
  onSellAndStakeInLiquididtyPool,
  onDepositLiquidity,
  onStakeLp,
  onWithdrawLp,
  activeControl,
  className,
}) => {
  const showInventoryWalletInfo =
    poolToken?.balance > 0.0001 || !!userNfts?.length;
  const showLiquidityWalletInfo =
    !!lpToken?.balance || poolToken?.balance > 0.0001 || !!userNfts?.length;

  return (
    <div className={classNames([styles.generalWalletInfo, className])}>
      {showInventoryWalletInfo && (
        <InventoryWalletInfo
          poolToken={poolToken}
          onStake={onStakeInInventory}
          onSellNft={userNfts?.length && onSellAndStakeInInventoryPool}
          activeControl={activeControl}
          className={styles.inventoryWalletInfo}
        />
      )}
      {showLiquidityWalletInfo && (
        <LiquidityWalletInfo
          className={styles.liquidityWalletInfo}
          poolToken={poolToken}
          lpToken={lpToken}
          onDepositLiquidity={onDepositLiquidity}
          onSellNft={userNfts?.length && onSellAndStakeInLiquididtyPool}
          onStakeLp={onStakeLp}
          onWithdrawLp={onWithdrawLp}
          activeControl={activeControl}
        />
      )}
    </div>
  );
};
