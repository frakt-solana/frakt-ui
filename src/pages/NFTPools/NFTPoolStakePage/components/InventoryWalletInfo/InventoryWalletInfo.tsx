import { FC } from 'react';

import { CONTROLS } from '../../constants';
import { WalletInfo } from '../WalletInfo';
import styles from './InventoryWalletInfo.module.scss';

interface InventoryWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  onStake?: () => void;
  onSellNft?: () => void;
  activeControl?: CONTROLS;
  className?: string;
}

export const InventoryWalletInfo: FC<InventoryWalletInfoProps> = ({
  poolToken,
  onStake,
  onSellNft,
  activeControl,
  className,
}) => {
  return (
    <div className={className}>
      <p className={styles.subtitle}>Wallet info</p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={
          poolToken?.balance > 0.0001
            ? {
                label: 'Stake rPWNG',
                action: onStake,
                btnPressedState:
                  activeControl === CONTROLS.STAKE_POOL_TOKEN_MODAL,
              }
            : null
        }
        secondAction={
          onSellNft
            ? {
                label: 'Sell NFT & Stake',
                action: onSellNft,
                btnPressedState:
                  activeControl === CONTROLS.SELECT_NFTS_INVENTORY,
              }
            : null
        }
      />
    </div>
  );
};
