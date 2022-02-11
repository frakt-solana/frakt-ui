import { FC } from 'react';
import Button from '../../../../../components/Button';

import {
  PoolData,
  RaydiumPoolInfo,
} from '../../../../../contexts/liquidityPools';
import { AccountInfoParsed } from '../../../../../utils/accounts';
import Withdraw from '../../../Withdraw';
import styles from './styles.module.scss';

interface PoolDetailsWalletConnectedProps {
  setDepositModalVisible: (depositModalVisible: boolean) => void;
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  lpTokenAccountInfo?: AccountInfoParsed;
  className?: string;
}

export const PoolDetailsWalletConnected: FC<PoolDetailsWalletConnectedProps> =
  ({
    setDepositModalVisible,
    poolData,
    raydiumPoolInfo,
    lpTokenAccountInfo,
    className,
  }) => {
    const { tokenInfo, poolConfig } = poolData;

    return (
      <div className={className}>
        <Withdraw
          baseToken={tokenInfo}
          poolConfig={poolConfig}
          raydiumPoolInfo={raydiumPoolInfo}
          lpTokenAccountInfo={lpTokenAccountInfo}
        />
        {/* <Rewards
                baseToken={tokenInfo}
                poolConfig={poolConfig}
                raydiumPoolInfo={raydiumPoolInfo}
              /> */}
        <Button
          onClick={() => setDepositModalVisible(true)}
          className={styles.depositBtn}
          type="alternative"
        >
          Deposit
        </Button>
      </div>
    );
  };
