import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';
import { useNftPoolsInitialFetch } from '../../../contexts/nftPools';
import { UserNFT } from '../../../contexts/userTokens';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useNFTsFiltering, usePoolPubkeyParam } from '../hooks';
import { FilterFormInputsNames } from '../model';
import { HeaderInfo } from '../NFTPoolInfoPage/components/HeaderInfo';
import {
  RewardsInfo,
  StakingDetails,
  StakingInfo,
  GeneralWalletInfo,
  DepositLiquidityModal,
  WithdrawLiquidityModal,
  StakePoolTokenModal,
  UnstakeInventoryModal,
  StakeAndWithdrawLP,
  useStakeAndWithdrawLP,
  useHarvestRewards,
  HarvestRewards,
} from './components';
import { useNftPoolStakePage, useStakingPageInfo } from './hooks';
import styles from './NFTPoolStakePage.module.scss';

const useModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    setVisible,
  };
};

// interface UseStakeModals = () => {

// }

// enum MODALS {
//   DEPOSIT_LIQUIDITY = 'depositLiquidity',
//   WITHDRAW_LIQUIDITY = 'withdrawLiquidity',
//   STAKE_POOL_TOKEN = 'stakePoolToken',
//   UNSTAKE_INVENTORY = 'unstakeInventory',
// }

// const useStakeModals = () => {
//   const {
//     visible: depositLiquidityModalVisible,
//     setVisible: setDepositLiquidityModalVisible,
//   } = useModal();

//   const {
//     visible: withdrawLiquidityModalVisible,
//     setVisible: setWithdrawLiquidityModalVisible,
//   } = useModal();

//   const {
//     visible: stakePoolTokenModalVisible,
//     setVisible: setStakePoolTokenModalVisible,
//   } = useModal();

//   const {
//     visible: unstakeInventoryModalVisible,
//     setVisible: setUnstakeInventoryModalVisible,
//   } = useModal();

//   return {
//     depositLiquidityModalVisible,
//     withdrawLiquidityModalVisible,
//     stakePoolTokenModalVisible,
//     unstakeInventoryModalVisible,

//     setDepositLiquidityModalVisible,
//     setWithdrawLiquidityModalVisible,
//     setStakePoolTokenModalVisible,
//     setUnstakeInventoryModalVisible,
//   };
// };

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
    inventoryAPR,
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
  } = useModal();

  const {
    visible: withdrawLiquidityModalVisible,
    setVisible: setWithdrawLiquidityModalVisible,
  } = useModal();

  const {
    visible: stakePoolTokenModalVisible,
    setVisible: setStakePoolTokenModalVisible,
  } = useModal();

  const {
    visible: unstakeInventoryModalVisible,
    setVisible: setUnstakeInventoryModalVisible,
  } = useModal();

  const {
    visible: stakeAndWithdrawLoadingVisible,
    close: closeStakeAndWithdrawLoading,
    stakeLp,
    withdrawLp,
  } = useStakeAndWithdrawLP({
    liquidityFusionPool,
    poolToken: poolTokenInfo,
    lpTokenBalance,
    raydiumLiquidityPoolKeys,
    raydiumPoolInfo,
  });

  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);
  const { control, nfts } = useNFTsFiltering(userNfts);

  const {
    harvest,
    visible: harvestLoadingVisible,
    close: closeHarvestLoading,
  } = useHarvestRewards({
    inventoryFusionPool,
    liquidityFusionPool,
  });

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
              apr={`${inventoryAPR.toFixed(2)} %`}
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
                  onStakeInInventory={() =>
                    setStakePoolTokenModalVisible((prev) => !prev)
                  }
                  onDepositLiquidity={() =>
                    setDepositLiquidityModalVisible((prev) => !prev)
                  }
                  onSellAndStakeInInventoryPool={
                    !!userNfts?.length && (() => {})
                  }
                  onSellAndStakeInLiquididtyPool={
                    !!userNfts?.length && (() => {})
                  }
                  onStakeLp={stakeLp}
                  onWithdrawLp={withdrawLp}
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
                  onUnstake={() =>
                    setUnstakeInventoryModalVisible((prev) => !prev)
                  }
                  onWithdraw={() =>
                    setWithdrawLiquidityModalVisible((prev) => !prev)
                  }
                  className={styles.stakingInfo}
                />
                <RewardsInfo
                  className={styles.rewardsInfo}
                  rewards={stakeRewards}
                  onHarvest={harvest}
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
                <div className={styles.modalWrapper}>
                  <WithdrawLiquidityModal
                    visible={withdrawLiquidityModalVisible}
                    setVisible={setWithdrawLiquidityModalVisible}
                    baseToken={poolTokenInfo}
                    raydiumLiquidityPoolKeys={raydiumLiquidityPoolKeys}
                    raydiumPoolInfo={raydiumPoolInfo}
                    lpTokenStakedAmount={lpTokensStaked}
                    withdrawStaked
                    liquidityFusionPool={liquidityFusionPool}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <StakePoolTokenModal
                    visible={stakePoolTokenModalVisible}
                    setVisible={setStakePoolTokenModalVisible}
                    poolToken={poolTokenInfo}
                    inventoryFusionPool={inventoryFusionPool}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <UnstakeInventoryModal
                    visible={unstakeInventoryModalVisible}
                    setVisible={setUnstakeInventoryModalVisible}
                    poolToken={poolTokenInfo}
                    inventoryFusionPool={inventoryFusionPool}
                    poolTokensStakedAmount={poolTokensStaked}
                  />
                </div>
              </>
            )}
          </div>
          {connected && !contentLoading && (
            <NFTPoolNFTsList
              nfts={nfts}
              setIsSidebar={() => {}}
              control={control}
              sortFieldName={FilterFormInputsNames.SORT}
              sortValues={SORT_VALUES}
              onCardClick={(nft) => {
                setSelectedNft(nft);
              }}
              selectedNft={selectedNft}
            />
          )}
        </div>
      )}
      <StakeAndWithdrawLP
        visible={stakeAndWithdrawLoadingVisible}
        close={closeStakeAndWithdrawLoading}
      />
      <HarvestRewards
        visible={harvestLoadingVisible}
        close={closeHarvestLoading}
      />
    </NFTPoolPageLayout>
  );
};
