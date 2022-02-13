import { FC } from 'react';
import Button from '../../../../../components/Button';

import {
  PoolData,
  ProgramAccountData,
  RaydiumPoolInfo,
} from '../../../../../contexts/liquidityPools';
import { AccountInfoParsed } from '../../../../../utils/accounts';
import Rewards from '../../../Rewards';
import Withdraw from '../../../Withdraw';
import styles from './styles.module.scss';

interface PoolDetailsWalletConnectedProps {
  setDepositModalVisible: (depositModalVisible: boolean) => void;
  poolData: PoolData;
  raydiumPoolInfo: RaydiumPoolInfo;
  lpTokenAccountInfo?: AccountInfoParsed;
  className?: string;
  programAccount: ProgramAccountData;
}

export const PoolDetailsWalletConnected: FC<PoolDetailsWalletConnectedProps> =
  ({
    setDepositModalVisible,
    poolData,
    raydiumPoolInfo,
    lpTokenAccountInfo,
    className,
    programAccount,
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
        <Rewards
          baseToken={tokenInfo}
          poolConfig={poolConfig}
          raydiumPoolInfo={raydiumPoolInfo}
          programAccount={programAccount}
        />
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
