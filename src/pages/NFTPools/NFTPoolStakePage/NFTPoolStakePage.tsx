import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';
import { useNftPoolsInitialFetch } from '../../../contexts/nftPools';
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
  SellAndStakeModal,
  SellAndDepositModal,
} from './components';
import { CONTROLS } from './constants';
import {
  useNftPoolStakePage,
  useStakeControls,
  useStakingPageInfo,
} from './hooks';
import styles from './NFTPoolStakePage.module.scss';

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
    activeControl,
    showHideModal,
    toggleModal,
    toggleSelectNftsVisisble,
    selectNftRef,
    selectedNft,
    onSelect: onSelectNft,
    onDeselect: onDeselectNft,
  } = useStakeControls();

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
                  userNfts={userNfts}
                  activeControl={activeControl}
                  onStakeInInventory={toggleModal(
                    CONTROLS.STAKE_POOL_TOKEN_MODAL,
                  )}
                  onDepositLiquidity={toggleModal(
                    CONTROLS.DEPOSIT_LIQUIDITY_MODAL,
                  )}
                  onSellAndStakeInInventoryPool={toggleSelectNftsVisisble(
                    CONTROLS.SELECT_NFTS_INVENTORY,
                  )}
                  onSellAndStakeInLiquididtyPool={toggleSelectNftsVisisble(
                    CONTROLS.SELECT_NFTS_LIQUIDITY,
                  )}
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
                  onUnstake={toggleModal(CONTROLS.UNSTAKE_INVENTORY_MODAL)}
                  onWithdraw={toggleModal(CONTROLS.WITHDRAW_LIQUIDITY_MODAL)}
                  activeControl={activeControl}
                  className={styles.stakingInfo}
                />
                <RewardsInfo
                  className={styles.rewardsInfo}
                  rewards={stakeRewards}
                  onHarvest={harvest}
                />
                <div className={styles.modalWrapper}>
                  <DepositLiquidityModal
                    visible={activeControl === CONTROLS.DEPOSIT_LIQUIDITY_MODAL}
                    setVisible={showHideModal(CONTROLS.DEPOSIT_LIQUIDITY_MODAL)}
                    baseToken={poolTokenInfo}
                    raydiumPoolInfo={raydiumPoolInfo}
                    apr={liquidityAPR}
                    raydiumLiquidityPoolKeys={raydiumLiquidityPoolKeys}
                    liquidityFusionPool={liquidityFusionPool}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <WithdrawLiquidityModal
                    visible={
                      activeControl === CONTROLS.WITHDRAW_LIQUIDITY_MODAL
                    }
                    setVisible={showHideModal(
                      CONTROLS.WITHDRAW_LIQUIDITY_MODAL,
                    )}
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
                    visible={activeControl === CONTROLS.STAKE_POOL_TOKEN_MODAL}
                    setVisible={showHideModal(CONTROLS.STAKE_POOL_TOKEN_MODAL)}
                    poolToken={poolTokenInfo}
                    inventoryFusionPool={inventoryFusionPool}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <UnstakeInventoryModal
                    visible={activeControl === CONTROLS.UNSTAKE_INVENTORY_MODAL}
                    setVisible={showHideModal(CONTROLS.UNSTAKE_INVENTORY_MODAL)}
                    poolToken={poolTokenInfo}
                    inventoryFusionPool={inventoryFusionPool}
                    poolTokensStakedAmount={poolTokensStaked}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <SellAndStakeModal
                    visible={
                      activeControl === CONTROLS.SELECT_NFTS_INVENTORY &&
                      !!selectedNft
                    }
                    onDeselect={onDeselectNft}
                    pool={pool}
                    poolToken={poolTokenInfo}
                    apr={inventoryAPR}
                    inventoryFusionPool={inventoryFusionPool}
                    nft={selectedNft}
                  />
                </div>
                <div className={styles.modalWrapper}>
                  <SellAndDepositModal
                    visible={
                      activeControl === CONTROLS.SELECT_NFTS_LIQUIDITY &&
                      !!selectedNft
                    }
                    onDeselect={onDeselectNft}
                    poolToken={poolTokenInfo}
                    pool={pool}
                    apr={liquidityAPR}
                    liquidityFusionPool={liquidityFusionPool}
                    nft={selectedNft}
                    raydiumLiquidityPoolKeys={raydiumLiquidityPoolKeys}
                    raydiumPoolInfo={raydiumPoolInfo}
                  />
                </div>
              </>
            )}
          </div>
          {connected && !contentLoading && (
            <NFTPoolNFTsList
              ref={selectNftRef}
              className={classNames({
                [styles.hidden]: !(
                  activeControl === CONTROLS.SELECT_NFTS_INVENTORY ||
                  activeControl === CONTROLS.SELECT_NFTS_LIQUIDITY
                ),
              })}
              nfts={nfts}
              setIsSidebar={() => {}}
              control={control}
              sortFieldName={FilterFormInputsNames.SORT}
              sortValues={SORT_VALUES}
              onCardClick={onSelectNft}
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
