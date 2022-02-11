import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import DepositModal from '../../../components/DepositModal';
import { useWalletModal } from '../../../contexts/WalletModal';
import { ChevronDownIcon } from '../../../icons';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../../utils';
import {
  formatNumberWithSpaceSeparator,
  PoolData,
  RaydiumPoolInfo,
} from '../../../contexts/liquidityPools';
import { PoolStats } from '../hooks';
import { useUserSplAccount } from '../../../utils/accounts';
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
}

const Pool: FC<PoolInterface> = ({
  isOpen,
  poolData,
  raydiumPoolInfo,
  onPoolCardClick = () => {},
  poolStats,
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
      <div className={styles.header}>
        {/* <div className={styles.awarder}>Awarded</div> */}
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
              $ {formatNumberWithSpaceSeparator(poolStats.liquidity)}
            </p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.title}>Apy</p>
            <p className={styles.value}>{poolStats.apy}%</p>
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
        poolStats={poolStats}
      />
    </div>
  );
};

export default Pool;
