import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import DepositModal from '../../../components/DepositModal/DepositModal';
import { SOL_TOKEN } from '../../../components/SwapForm/constants';
import { useWalletModal } from '../../../contexts/WalletModal';
import { ChevronDownIcon } from '../../../icons';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import { Token } from '../../../utils';
import Withdraw from '../Withdraw';
import Rewards from '../Rewards';

interface PoolInterface {
  quoteToken: Token;
}

const Pool: FC<PoolInterface> = ({ quoteToken }) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [detailsBlockVisible, setDetailsBlockVisible] =
    useState<boolean>(false);
  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);

  return (
    <div className={styles.pool}>
      <div className={styles.header}>
        <div className={styles.awarder}>Awarded</div>
      </div>
      <div
        className={styles.poolCard}
        onClick={() => setDetailsBlockVisible((prev) => !prev)}
      >
        <div className={styles.tokenInfo}>
          <div>
            <img src={quoteToken.img} className={styles.image} />
            <img src={SOL_TOKEN.img} className={styles.image} />
          </div>
          <div className={styles.subtitle}>
            {quoteToken.symbol} / {SOL_TOKEN.symbol}
          </div>
        </div>

        <div className={styles.statsValue}>
          <div className={styles.totalValue}>
            <p className={styles.title}>Total liquidity</p>
            <p className={styles.value}>$ 120 120 000</p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.title}>Apr</p>
            <p className={styles.value}>30%</p>
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
