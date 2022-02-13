import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import DepositModal from '../../../components/DepositModal';
import { useWalletModal } from '../../../contexts/WalletModal';
import { ChevronDownIcon } from '../../../icons';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../../utils';
import {
  formatNumberWithSpaceSeparator,
  PoolData,
  ProgramAccountData,
  RaydiumPoolInfo,
} from '../../../contexts/liquidityPools';
import { PoolStats } from '../hooks';
import { useUserSplAccount } from '../../../utils/accounts';
import {
  PoolDetailsWalletConnected,
  PoolDetailsWalletDisconnected,
} from './components';
import { usePolling } from '../../../hooks';
import { FUSION_PROGRAM_PUBKEY } from '../../../contexts/liquidityPools/transactions/fusionPools';
import { PublicKey } from '@solana/web3.js';
import { fetchProgramAccountByRouter } from '../../../contexts/liquidityPools/liquidityPools.helpers';
interface PoolInterface {
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  poolStats: PoolStats;
  isOpen: boolean;
  onPoolCardClick?: () => void;
  programAccount: ProgramAccountData;
}

const POOL_INFO_POLLING_INTERVAL = 10_000;

const Pool: FC<PoolInterface> = ({
  isOpen,
  poolData,
  raydiumPoolInfo,
  onPoolCardClick = () => {},
  programAccount,
  poolStats,
}) => {
  const { tokenInfo, poolConfig } = poolData;
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const [programAccountPool, setProgramAccountPool] =
    useState<ProgramAccountData>(programAccount);

  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  const {
    accountInfo: lpTokenAccountInfo,
    subscribe,
    unsubscribe,
  } = useUserSplAccount();

  const poll = async () => {
    const raydiumPoolInfoMap = await fetchProgramAccountByRouter({
      vaultProgramId: new PublicKey(FUSION_PROGRAM_PUBKEY),
      connection,
      routerPubkeys: 'EsF2vf7bQAs4JEm6WkNRvDcgKziskFYc7Zp87mEQCckb',
    });
    setProgramAccountPool(raydiumPoolInfoMap);
  };

  const { isPolling, startPolling, stopPolling } = usePolling(
    poll,
    POOL_INFO_POLLING_INTERVAL,
  );

  useEffect(() => {
    if (isOpen && !isPolling) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          programAccount={programAccount}
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
        programAccount={programAccount}
        poolStats={poolStats}
      />
    </div>
  );
};

export default Pool;
