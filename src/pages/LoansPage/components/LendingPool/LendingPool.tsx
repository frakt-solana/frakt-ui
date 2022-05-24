import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { PoolModal } from '../../../../components/PoolModal';
import { LoansPoolData, useLoansPage } from '../../hooks';
import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { SOL_TOKEN } from '../../../../utils';
import { TabsNames } from '../../../../components/PoolModal/usePoolModal';
import { useWalletModal } from '../../../../contexts/WalletModal';
import Tooltip from '../../../../components/Tooltip';

const MIN_AVAILABLE_VALUE_FOR_HARVEST = 0.001;

interface LendingPoolProps {
  loansPoolData: LoansPoolData;
}

const LendingPool: FC<LendingPoolProps> = ({ loansPoolData }) => {
  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const { connected } = useWallet();

  const {
    userDeposit,
    apr,
    totalSupply,
    userLoans,
    utilizationRate,
    loanPoolReward,
  } = loansPoolData;

  const { harvestLiquidity } = useLoansPage();
  const { setVisible } = useWalletModal();

  const openPoolModal = (tab: TabsNames) => {
    if (!connected) {
      setVisible(true);
    } else {
      setPoolModalVisible(tab);
    }
  };

  const isDisabledBtn = loanPoolReward < MIN_AVAILABLE_VALUE_FOR_HARVEST;

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.header}>
          {connected && !!userDeposit && (
            <>
              <div className={styles.rewards}>
                <p className={styles.reward}>
                  Pending Rewards: {loanPoolReward?.toFixed(3)} SOL
                </p>
              </div>

              <Tooltip
                placement="top"
                overlay="Harvest is available from 0.001 SOL"
              >
                <div>
                  <Button
                    onClick={harvestLiquidity}
                    className={classNames(styles.btn, styles.btnHarvest)}
                    disabled={isDisabledBtn}
                    type="tertiary"
                  >
                    Harvest
                  </Button>
                </div>
              </Tooltip>
            </>
          )}
        </div>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <div>
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/dapeM1DJj3xf2rC5o3Gcz1Cg3Rdu2ayZae9nGcsRRZT/logo.png"
                className={styles.image}
              />
              <img
                src="https://arweave.net/QTbFKiBGSYIJJna0QafYgAxNyAtuhwssEJliiJa0eyE?ext=png"
                style={{ marginLeft: '-25px' }}
                className={styles.image}
              />
              <img
                src="https://arweave.net/2OINffkTFvUwtPFfNKkNzQ7h8m-1UZsqQkr6bXKIH70"
                style={{ marginLeft: '-25px' }}
                className={styles.image}
              />
              <img src={SOL_TOKEN.logoURI} className={styles.image} />
            </div>
            <div className={styles.subtitle}>Aggregated Lending Pool</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total supply</p>
              <p className={styles.value}>{totalSupply} SOL</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>APR</p>
              <p className={styles.value}>{apr.toFixed(2)} %</p>
            </div>
            {connected && (
              <>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your deposit</p>
                  <p className={styles.value}>{userDeposit} SOL</p>
                </div>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your loans</p>
                  <p className={styles.value}>{userLoans}</p>
                </div>
              </>
            )}
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="tertiary"
                onClick={() => openPoolModal(TabsNames.WITHDRAW)}
                disabled={connected && !userDeposit}
              >
                Withdraw
              </Button>
              <Button
                className={styles.btn}
                type="alternative"
                onClick={() => openPoolModal(TabsNames.DEPOSIT)}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(null)}
        apr={apr}
        userDeposit={userDeposit}
        utilizationRate={utilizationRate}
      />
    </>
  );
};

export default LendingPool;
