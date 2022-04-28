import { FC } from 'react';
import classNames from 'classnames';

import styles from './LiquidityWalletInfo.module.scss';
import { WalletInfo } from '../WalletInfo';
import { CONTROLS } from '../../constants';

interface LiquidityWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  lpToken?: {
    ticker: string;
    balance: number;
  };
  onSellNft: () => void;
  onDepositLiquidity: () => void;
  onStakeLp: () => void;
  onWithdrawLp: () => void;
  activeControl?: CONTROLS;
  className?: string;
}

export const LiquidityWalletInfo: FC<LiquidityWalletInfoProps> = ({
  poolToken,
  lpToken,
  onSellNft,
  onDepositLiquidity,
  onStakeLp,
  onWithdrawLp,
  activeControl,
  className,
}) => {
  const showPoolTokenInfo = poolToken?.balance > 0.0001 || !!onSellNft;
  const showLpTokenInfo = !!lpToken?.balance;

  return (
    <div className={classNames(styles.liquidityWalletInfoMain, className)}>
      <p className={styles.subtitle}>Wallet info</p>
      {showPoolTokenInfo && (
        <WalletInfo
          title={poolToken?.ticker || 'Unknown'}
          balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
          firstAction={
            poolToken?.balance > 0.0001
              ? {
                  label: 'Deposit',
                  action: onDepositLiquidity,
                  btnPressedState:
                    activeControl === CONTROLS.DEPOSIT_LIQUIDITY_MODAL,
                }
              : null
          }
          secondAction={
            onSellNft
              ? {
                  label: 'Sell NFT & Deposit',
                  action: onSellNft,
                  btnPressedState:
                    activeControl === CONTROLS.SELECT_NFTS_LIQUIDITY,
                }
              : null
          }
          className={classNames([
            styles.poolTokenIntfo,
            { [styles.halfWidth]: !!lpToken?.balance },
          ])}
        />
      )}
      {showLpTokenInfo && (
        <WalletInfo
          title={lpToken.ticker || 'Unknown'}
          balance={lpToken.balance ? lpToken.balance.toFixed(3) : '0'}
          firstAction={{ label: 'Stake', action: onStakeLp }}
          secondAction={{ label: 'Withdraw', action: onWithdrawLp }}
          className={classNames([
            styles.lpTokenInfo,
            { [styles.firstColumnt]: !showPoolTokenInfo },
          ])}
        />
      )}
    </div>
  );
};
