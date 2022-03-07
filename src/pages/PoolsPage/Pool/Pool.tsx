import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { useWalletModal } from '../../../contexts/WalletModal';
import { useUserSplAccount } from '../../../utils/accounts';
import DepositModal from '../../../components/DepositModal';
import { ChevronDownIcon } from '../../../icons';
import { usePolling } from '../../../hooks';
import { SOL_TOKEN } from '../../../utils';
import styles from './styles.module.scss';
import {
  formatNumberWithSpaceSeparator,
  PoolData,
  FusionPoolInfo,
  RaydiumPoolInfo,
  useLazyFusionPools,
} from '../../../contexts/liquidityPools';
import { PoolStats } from '../hooks';
import {
  PoolDetailsWalletConnected,
  PoolDetailsWalletDisconnected,
} from './components';
interface PoolInterface {
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  poolStats: PoolStats;
  isOpen: boolean;
  onPoolCardClick?: () => void;
  fusionPoolInfo: FusionPoolInfo;
}

const POOL_INFO_POLLING_INTERVAL = 10_000;

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
  const { fetchFusionPoolsInfo, fusionPoolInfoMap } = useLazyFusionPools();

  const fetchFusionPoolInfo = fusionPoolInfoMap.get(
    poolData.poolConfig.lpMint.toBase58(),
  );

  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  const {
    accountInfo: lpTokenAccountInfo,
    subscribe,
    unsubscribe,
  } = useUserSplAccount();

  const poll = async () => {
    await fetchFusionPoolsInfo([poolData.poolConfig.lpMint.toBase58()]);
  };

  const { isPolling, startPolling, stopPolling } = usePolling(
    poll,
    POOL_INFO_POLLING_INTERVAL,
  );

  useEffect(() => {
    if (isOpen && !isPolling && connected) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, connected]);

  useEffect(() => {
    if (isOpen && connected) {
      subscribe(poolConfig.lpMint);
    }
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, connected]);

  return (
    <div className={styles.pool}>
      <div className={styles.header}>
        {fusionPoolInfo?.mainRouter && (
          <div className={styles.awarder}>Awarded</div>
        )}
      </div>
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
            <p className={styles.title}>Apy</p>
            <p className={styles.value}>{poolStats?.apy || 0}%</p>
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
          fusionPoolInfo={fetchFusionPoolInfo || fusionPoolInfo}
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
        fusionPoolInfo={fetchFusionPoolInfo || fusionPoolInfo}
        poolStats={poolStats}
      />
    </div>
  );
};

export default Pool;
