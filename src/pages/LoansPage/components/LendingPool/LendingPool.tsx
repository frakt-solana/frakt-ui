import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { PoolModal } from '../../../../components/PoolModal';
import { LoansPoolInfo, useLoansPage } from '../../hooks';
import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { TabsNames } from '../../../../components/PoolModal/usePoolModal';
import Tooltip from '../../../../components/Tooltip';
import BearsImage from '../mockImage/Bears.png';
import DegodsImage from '../mockImage/Degods.png';
import { commonActions } from '../../../../state/common/actions';

const MIN_AVAILABLE_VALUE_FOR_HARVEST = 0.001;

interface LendingPoolProps {
  loansPoolInfo: LoansPoolInfo;
}

const LendingPool: FC<LendingPoolProps> = ({ loansPoolInfo }) => {
  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const {
    depositAmount,
    apr,
    totalSupply,
    loans,
    utilizationRate,
    rewardAmount,
    totalBorrowed,
  } = loansPoolInfo;

  const { harvestLiquidity } = useLoansPage();

  const openPoolModal = (tab: TabsNames) => {
    if (!connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setPoolModalVisible(tab);
    }
  };

  const isDisabledBtn = rewardAmount < MIN_AVAILABLE_VALUE_FOR_HARVEST;

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.header}>
          {connected && !!depositAmount && (
            <>
              <div className={styles.rewards}>
                <p className={styles.reward}>
                  Pending Rewards: {rewardAmount?.toFixed(4)} SOL
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
            <div className={styles.tokenImage}>
              <img src={BearsImage} className={styles.image} />
              <img
                src={DegodsImage}
                style={{ marginLeft: '-25px' }}
                className={styles.image}
              />
            </div>
            <div className={styles.subtitle}>Aggregated Lending Pool</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total liquidity</p>
              <p className={styles.value}>{totalSupply.toFixed(2)} SOL</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Deposit APR</p>
              <p className={styles.value}>{apr.toFixed(2)} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total borrowed</p>
              <p className={styles.value}>{totalBorrowed.toFixed(2)} SOL</p>
            </div>
            {connected && (
              <>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your liquidity</p>
                  <p className={styles.value}>{depositAmount} SOL</p>
                </div>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your loans</p>
                  <p className={styles.value}>{loans}</p>
                </div>
              </>
            )}
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="tertiary"
                onClick={() => openPoolModal(TabsNames.WITHDRAW)}
                disabled={connected && !depositAmount}
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
        depositAmount={depositAmount}
        utilizationRate={utilizationRate}
      />
    </>
  );
};

export default LendingPool;
