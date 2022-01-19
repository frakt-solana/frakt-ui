import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
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
  RaydiumPoolInfo,
  useCurrentSolanaPrice,
} from '../../../contexts/liquidityPools';

interface PoolInterface {
  quoteToken: TokenInfo;
  activeId: number;
  isAwarded: boolean;
  raydiumPoolInfo: RaydiumPoolInfo;
}

const Pool: FC<PoolInterface> = ({
  quoteToken,
  raydiumPoolInfo,
  isAwarded,
}) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const [detailsBlockVisible, setDetailsBlockVisible] =
    useState<boolean>(false);
  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  return (
    <div className={styles.pool}>
      <div className={styles.header}>
        {isAwarded && <div className={styles.awarder}>Awarded</div>}
      </div>
      <div
        className={styles.poolCard}
        onClick={() => setDetailsBlockVisible((prev) => !prev)}
      >
        <div className={styles.tokenInfo}>
          <div>
            <img src={quoteToken.logoURI} className={styles.image} />
            <img src={SOL_TOKEN.logoURI} className={styles.image} />
          </div>
          <div className={styles.subtitle}>
            {quoteToken.symbol} / {SOL_TOKEN.symbol}
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
            detailsBlockVisible && styles.rotate,
          )}
        />
      </div>
      {detailsBlockVisible && (
        <div className={styles.poolDetails}>
          {connected ? (
            <>
              <Withdraw quoteToken={quoteToken} />
              <Rewards quoteToken={quoteToken} />
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
        quoteToken={quoteToken}
        baseToken={SOL_TOKEN}
      />
    </div>
  );
};

export default Pool;
