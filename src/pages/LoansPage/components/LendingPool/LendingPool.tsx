import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { PoolModal } from '../../../../components/PoolModal';
import { useLoansPage } from '../../hooks';
import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { TabsNames } from '../../../../components/PoolModal/usePoolModal';
import Tooltip from '../../../../components/Tooltip';
import { commonActions } from '../../../../state/common/actions';
import { LiquidityPool } from '../../../../state/loans/types';

interface LendingPoolProps {
  liquidityPool: LiquidityPool;
}

const LendingPool: FC<LendingPoolProps> = ({ liquidityPool }) => {
  const [poolModalVisible, setPoolModalVisible] = useState<TabsNames>(null);
  const { connected } = useWallet();
  const dispatch = useDispatch();

  const {
    name,
    pubkey: liquidityPoolPubkey,
    borrowApr,
    depositApr,
    totalLiquidity,
    userActiveLoansAmount,
    totalBorrowed,
    utilizationRate,
    userDeposit,
  } = liquidityPool;

  const openPoolModal = (tab: TabsNames) => {
    if (!connected) {
      dispatch(commonActions.setWalletModal({ isVisible: true }));
    } else {
      setPoolModalVisible(tab);
    }
  };

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.header}>
          {connected && !!userDeposit?.depositAmount && (
            <Rewards liquidityPool={liquidityPool} />
          )}
        </div>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <LiquidityPoolImage liquidityPool={liquidityPool} />
            <div className={styles.subtitle}>{name || ''}</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total liquidity</p>
              <p className={styles.value}>{totalLiquidity.toFixed(2)} SOL</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Deposit APR</p>
              <p className={styles.value}>{depositApr.toFixed(2)} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Interest rate</p>
              <p className={styles.value}>{borrowApr?.toFixed(2) || 0} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total borrowed</p>
              <p className={styles.value}>{totalBorrowed.toFixed(2)} SOL</p>
            </div>
            {connected && (
              <>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your liquidity</p>
                  <p className={styles.value}>
                    {userDeposit?.depositAmount.toFixed(2) || 0} SOL
                  </p>
                </div>
                <div className={styles.totalValue}>
                  <p className={styles.title}>Your loans</p>
                  <p className={styles.value}>{userActiveLoansAmount || 0}</p>
                </div>
              </>
            )}
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="tertiary"
                onClick={() => openPoolModal(TabsNames.WITHDRAW)}
                disabled={connected && !userDeposit?.depositAmount}
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
        liquidityPoolPubkey={liquidityPoolPubkey}
        apr={depositApr}
        depositAmount={userDeposit?.depositAmount}
        utilizationRate={utilizationRate}
      />
    </>
  );
};

const LiquidityPoolImage: FC<LendingPoolProps> = ({ liquidityPool }) => {
  const { isPriceBased, collectionsAmount } = liquidityPool;

  const showLabelCollectionsAmount = collectionsAmount - 2 > 0;

  return (
    <div
      className={classNames(styles.poolImage, {
        [styles.poolImageWithLabel]:
          !isPriceBased && showLabelCollectionsAmount,
      })}
      data-collections-amount={`+${collectionsAmount - 2}`}
    >
      {liquidityPool.imageUrl?.map((image: string, idx: number) => (
        <img
          src={image}
          className={styles.image}
          key={idx}
          style={idx !== 0 ? { marginLeft: '-25px' } : null}
        />
      ))}
    </div>
  );
};

const MIN_AVAILABLE_VALUE_FOR_HARVEST = 0.001;

const Rewards: FC<LendingPoolProps> = ({ liquidityPool }) => {
  const { userDeposit } = liquidityPool;

  const isDisabledBtn =
    userDeposit?.harvestAmount < MIN_AVAILABLE_VALUE_FOR_HARVEST;

  const { harvestLiquidity } = useLoansPage();

  const tooltipText = 'Harvest is available from 0.001 SOL';

  return (
    <div className={styles.rewards}>
      <p className={styles.reward}>
        Pending Rewards: {userDeposit?.harvestAmount?.toFixed(4)} SOL
      </p>
      {isDisabledBtn ? (
        <Tooltip placement="top" overlay={tooltipText}>
          <div>
            <Button
              className={classNames(styles.btn, styles.btnHarvest)}
              disabled
              type="tertiary"
            >
              Harvest
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button
          onClick={() => harvestLiquidity(liquidityPool?.pubkey)}
          className={classNames(styles.btn, styles.btnHarvest)}
          type="tertiary"
        >
          Harvest
        </Button>
      )}
    </div>
  );
};

export default LendingPool;
