import { FC } from 'react';
import Button from '../../../../../components/Button';

import {
  PoolData,
  FusionPoolInfo,
  RaydiumPoolInfo,
} from '../../../../../contexts/liquidityPools';
import { AccountInfoParsed } from '../../../../../utils/accounts';
import Rewards from '../../../Rewards';
import Withdraw from '../../../Withdraw';
import styles from './PoolDetailsWalletConnected.module.scss';

interface PoolDetailsWalletConnectedProps {
  setDepositModalVisible: (depositModalVisible: boolean) => void;
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  lpTokenAccountInfo?: AccountInfoParsed;
  className?: string;
  fusionPoolInfo: FusionPoolInfo;
}

export const PoolDetailsWalletConnected: FC<PoolDetailsWalletConnectedProps> =
  ({
    setDepositModalVisible,
    poolData,
    raydiumPoolInfo,
    lpTokenAccountInfo,
    className,
    fusionPoolInfo,
  }) => {
    const { tokenInfo, poolConfig } = poolData;

    return (
      <div className={className}>
        <Withdraw
          baseToken={tokenInfo}
          poolConfig={poolConfig}
          raydiumPoolInfo={raydiumPoolInfo}
          lpTokenAccountInfo={lpTokenAccountInfo}
          fusionPoolInfo={fusionPoolInfo}
        />
        {fusionPoolInfo?.mainRouter && (
          <Rewards
            baseToken={tokenInfo}
            poolConfig={poolConfig}
            raydiumPoolInfo={raydiumPoolInfo}
            fusionPoolInfo={fusionPoolInfo}
            lpTokenAccountInfo={lpTokenAccountInfo}
          />
        )}
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
