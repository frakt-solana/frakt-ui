import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import DepositModal from '../../../components/DepositModal/DepositModal';
import { useWalletModal } from '../../../contexts/WalletModal';
import { ChevronDownIcon } from '../../../icons';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import Withdraw from '../Withdraw';
import Rewards from '../Rewards';
import { SOL_TOKEN } from '../../../utils';
import {
  calculateAPR,
  calculateTVL,
  fetchRaydiumPoolsInfoMap,
  PoolData,
  RaydiumPoolInfo,
} from '../../../contexts/liquidityPools';
import { usePolling } from '../../../hooks';

interface PoolInterface {
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  isOpen: boolean;
  onPoolCardClick?: () => void;
  currentSolanaPriceUSD: number;
}

const POOL_INFO_POLLING_INTERVAL = 5000;

const Pool: FC<PoolInterface> = ({
  isOpen,
  poolData,
  raydiumPoolInfo: defaultRaydiumPoolInfo,
  onPoolCardClick = () => {},
  currentSolanaPriceUSD,
}) => {
  const { isAwarded, tokenInfo, poolConfig } = poolData;

  const { connection } = useConnection();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [raydiumPoolInfo, setRaydiumPoolInfo] = useState<RaydiumPoolInfo>(
    defaultRaydiumPoolInfo,
  );

  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  const poll = async () => {
    const raydiumPoolInfoMap = await fetchRaydiumPoolsInfoMap(connection, [
      poolConfig,
    ]);
    setRaydiumPoolInfo(raydiumPoolInfoMap.get(tokenInfo.address));
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

  return (
    <div className={styles.pool}>
      <div className={styles.header}>
        {isAwarded && <div className={styles.awarder}>Awarded</div>}
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
              $ {calculateTVL(raydiumPoolInfo, currentSolanaPriceUSD)}
            </p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.title}>Apr</p>
            <p className={styles.value}>
              {calculateAPR(raydiumPoolInfo, currentSolanaPriceUSD)}
            </p>
          </div>
        </div>
        <ChevronDownIcon
          className={classNames(
            styles.chevronVisibleIcon,
            isOpen && styles.rotate,
          )}
        />
      </div>
      {isOpen && (
        <div className={styles.poolDetails}>
          {connected ? (
            <>
              <Withdraw
                baseToken={tokenInfo}
                poolConfig={poolConfig}
                raydiumPoolInfo={raydiumPoolInfo}
              />
              {isAwarded && <Rewards quoteToken={tokenInfo} />}
              <Button
                onClick={() => setDepositModalVisible(true)}
                className={styles.depositBtn}
                type="alternative"
              >
                Deposit
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setVisible(true)}
              className={styles.connectBtn}
            >
              Connect wallet
            </Button>
          )}
        </div>
      )}
      <DepositModal
        visible={depositModalVisible}
        onCancel={() => setDepositModalVisible(false)}
        tokenInfo={tokenInfo}
        poolConfig={poolConfig}
      />
    </div>
  );
};

export default Pool;
