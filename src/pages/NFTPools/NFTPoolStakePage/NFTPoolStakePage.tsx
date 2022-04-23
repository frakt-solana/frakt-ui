import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';
import { useNftPoolsInitialFetch } from '../../../contexts/nftPools';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { usePoolPubkeyParam } from '../hooks';
import { HeaderInfo } from '../NFTPoolInfoPage/components/HeaderInfo';
import {
  RewardsInfo,
  StakingDetails,
  StakingInfo,
  GeneralWalletInfo,
  DepositLiquidityModal,
} from './components';
import { useNftPoolStakePage, useStakingPageInfo } from './hooks';
import styles from './NFTPoolStakePage.module.scss';

const useDepositLiquidityModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    setVisible,
  };
};

export const NFTPoolStakePage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();

  const { connected } = useWallet();

  const {
    pool,
    poolTokenInfo,
    userNfts,
    raydiumPoolInfo,
    raydiumLiquidityPoolKeys,
    inventoryFusionPool,
    liquidityFusionPool,
    pageLoading: pageLoadingNftPool,
    contentLoading: contentLoadingNftPool,
  } = useNftPoolStakePage(poolPubkey);

  const {
    loading: stakingInfoLoading,
    inverntoryAPR,
    liquidityAPR,
    raydiumPoolLiquidityUSD,
    inventoryTotalLiquidity,
    poolTokenBalance,
    lpTokenBalance,
    poolTokensStaked,
    lpTokensStaked,
    stakeRewards,
  } = useStakingPageInfo({
    inventoryFusionPool,
    liquidityFusionPool,
    poolTokenInfo,
  });

  const pageLoading = pageLoadingNftPool;
  const contentLoading = contentLoadingNftPool || stakingInfoLoading;

  const {
    visible: depositLiquidityModalVisible,
    setVisible: setDepositLiquidityModalVisible,
  } = useDepositLiquidityModal();

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderInfo
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          hidden={pageLoading}
        />
      }
      tab={POOL_TABS.STAKE}
    >
      {contentLoading ? (
        <Loader size="large" />
      ) : (
        <div className={styles.root}>
          <div className={styles.stakingWrapper}>
            <StakingDetails
              className={styles.stakingInfoInventory}
              title="Inventory Staking"
              infoText="Stake pool tokens without any risk but with reduced rewards"
              totalLiquidity={`$ ${formatNumberWithSpaceSeparator(
                inventoryTotalLiquidity || 0,
              )}`}
              apr={`${inverntoryAPR.toFixed(2)} %`}
            />
            <StakingDetails
              className={styles.stakingInfoLiquidity}
              title="Liquidity Staking"
              infoText="Stake LP tokens with high rewards but with risk of impermanent
              loss"
              totalLiquidity={`$ ${formatNumberWithSpaceSeparator(
                raydiumPoolLiquidityUSD || 0,
              )}`}
              apr={`${liquidityAPR.toFixed(2)} %`}
              isRisky
            />
            {connected && (
              <>
                <GeneralWalletInfo
                  className={styles.generalWalletInfo}
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokenBalance,
                  }}
                  lpToken={{
                    ticker: `${poolTokenInfo?.symbol}/SOL`,
                    balance: lpTokenBalance,
                  }}
                  onDepositLiquidity={() =>
                    setDepositLiquidityModalVisible(true)
                  }
                  onSellAndStakeInInventoryPool={
                    !!userNfts?.length && (() => {})
                  }
                  onSellAndStakeInLiquididtyPool={
                    !!userNfts?.length && (() => {})
                  }
                />
                <p
                  className={classNames(
                    styles.subtitle,
                    styles.subtitleStaking,
                  )}
                >
                  Staking info
                </p>
                <StakingInfo
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokensStaked,
                  }}
                  lpToken={{
                    ticker: `${poolTokenInfo?.symbol}/SOL`,
                    balance: lpTokensStaked,
                  }}
                  className={styles.stakingInfo}
                />
                <RewardsInfo
                  className={styles.rewardsInfo}
                  rewards={stakeRewards}
                />
                <div className={styles.modalWrapper}>
                  <DepositLiquidityModal
                    visible={depositLiquidityModalVisible}
                    setVisible={setDepositLiquidityModalVisible}
                    baseToken={poolTokenInfo}
                    raydiumPoolInfo={raydiumPoolInfo}
                    apr={liquidityAPR}
                    raydiumLiquidityPoolKeys={raydiumLiquidityPoolKeys}
                    liquidityFusionPool={liquidityFusionPool}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};
