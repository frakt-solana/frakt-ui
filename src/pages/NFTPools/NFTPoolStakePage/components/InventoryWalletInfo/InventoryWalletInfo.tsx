import { FC } from 'react';

import { WalletInfo } from '../WalletInfo';
import styles from './InventoryWalletInfo.module.scss';

interface InventoryWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  onStake: () => void;
  onSellNft: () => void;
  className?: string;
}

export const InventoryWalletInfo: FC<InventoryWalletInfoProps> = ({
  poolToken,
  onStake,
  onSellNft,
  className,
}) => {
  return (
    <div className={className}>
      <p className={styles.subtitle}>Wallet info</p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={
          poolToken?.balance ? { label: 'Stake rPWNG', action: onStake } : null
        }
        secondAction={
          onSellNft ? { label: 'Sell NFT & Stake', action: onSellNft } : null
        }
      />
    </div>
  );
};
