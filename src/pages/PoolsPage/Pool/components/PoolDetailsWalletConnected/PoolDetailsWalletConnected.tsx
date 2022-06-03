import classNames from 'classnames/bind';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import Button from '../../../../../components/Button';
import { Loader } from '../../../../../components/Loader';
import {
  PoolData,
  FusionPoolInfo,
  RaydiumPoolInfo,
} from '../../../../../contexts/liquidityPools';
import { selectUserTokensState } from '../../../../../state/userTokens/selectors';
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

    const { loading } = useSelector(selectUserTokensState);

    return (
      <div className={classNames(styles.root, className)}>
        {loading ? (
          <Loader size="default" />
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  };
