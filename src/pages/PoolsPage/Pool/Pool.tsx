import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { useWalletModal } from '../../../contexts/WalletModal';
import { useUserSplAccount } from '../../../utils/accounts';
import DepositModal from '../../../components/DepositModal';
import { ChevronDownIcon } from '../../../icons';
import { SOL_TOKEN } from '../../../utils';
import styles from './Pool.module.scss';
import {
  formatNumberWithSpaceSeparator,
  PoolData,
  FusionPoolInfo,
  RaydiumPoolInfo,
} from '../../../contexts/liquidityPools';
import {
  PoolDetailsWalletConnected,
  PoolDetailsWalletDisconnected,
} from './components';
import { PoolCardHeader } from './components/PoolCardHeader';
import { PoolStats } from '../model';

interface PoolInterface {
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  poolStats: PoolStats;
  isOpen: boolean;
  onPoolCardClick?: () => void;
  fusionPoolInfo: FusionPoolInfo;
}

const Pool: FC<PoolInterface> = ({
  isOpen,
  poolData,
  raydiumPoolInfo,
  onPoolCardClick = () => {},
  poolStats,
  fusionPoolInfo,
}) => {
  const { tokenInfo, poolConfig } = poolData;
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  const {
    accountInfo: lpTokenAccountInfo,
    subscribe,
    unsubscribe,
  } = useUserSplAccount();

  useEffect(() => {
    if (isOpen && connected) {
      subscribe(poolConfig.lpMint);
    }
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, connected]);

  return (
    <div className={styles.pool}>
      <PoolCardHeader isAwarded={!!fusionPoolInfo?.mainRouter} />
      <div className={styles.poolCard} onClick={onPoolCardClick}>
        <div className={styles.tokenInfo}>
          <div>
            <img src={tokenInfo.logoURI} className={styles.image} />
            <img src={SOL_TOKEN.logoURI} className={styles.image} />
          </div>
          <div className={styles.subtitle}>
            {tokenInfo.symbol} / {SOL_TOKEN.symbol}
          </div>
        </div>

        <div className={styles.statsValue}>
          <div className={styles.totalValue}>
            <p className={styles.title}>Total liquidity</p>
            <p className={styles.value}>
              $ {formatNumberWithSpaceSeparator(poolStats?.liquidity || 0)}
            </p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.title}>Apr</p>
            <p className={styles.value}>{poolStats?.apr || 0}%</p>
          </div>
        </div>

        <ChevronDownIcon
          className={classNames(
            styles.chevronVisibleIcon,
            isOpen && styles.rotate,
          )}
        />
      </div>
      {isOpen && connected && (
        <PoolDetailsWalletConnected
          setDepositModalVisible={setDepositModalVisible}
          poolData={poolData}
          raydiumPoolInfo={raydiumPoolInfo}
          lpTokenAccountInfo={lpTokenAccountInfo}
          className={styles.poolDetails}
          fusionPoolInfo={fusionPoolInfo}
        />
      )}
      {isOpen && !connected && (
        <PoolDetailsWalletDisconnected
          setWalletModalVisible={setVisible}
          className={styles.poolDetails}
        />
      )}
      <DepositModal
        visible={depositModalVisible}
        setVisible={setDepositModalVisible}
        onCancel={() => setDepositModalVisible(false)}
        tokenInfo={tokenInfo}
        poolConfig={poolConfig}
        fusionPoolInfo={fusionPoolInfo}
        poolStats={poolStats}
        lpTokenAccountInfo={lpTokenAccountInfo}
      />
    </div>
  );
};

export default Pool;
