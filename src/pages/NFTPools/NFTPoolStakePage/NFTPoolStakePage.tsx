import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC, useMemo } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { useTokenListContext } from '../../../contexts/TokenList';
import { usePublicKeyParam } from '../../../hooks';
import { useSplTokenBalance } from '../../../utils/accounts';
import { useCachedPoolsStats } from '../../PoolsPage';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useAPR, usePoolPubkeyParam, useUserRawNfts } from '../hooks';
import { HeaderInfo } from '../NFTPoolInfoPage/components/HeaderInfo';
import {
  RewardsInfo,
  StakingDetails,
  StakingInfo,
  WalletInfo,
} from './components';
import styles from './NFTPoolStakePage.module.scss';

export const NFTPoolStakePage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();

  const { connected } = useWallet();

  const {
    pool,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const { rawNfts, rawNftsLoading } = useUserRawNfts();

  const whitelistedNFTs = useMemo(() => {
    return filterWhitelistedNFTs(
      rawNfts || [],
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const { loading: aprLoading, liquidityAPR } = useAPR(poolTokenInfo);

  const { poolsStatsByBaseTokenMint, loading: poolsStatsLoading } =
    useCachedPoolsStats();
  const poolStats = poolsStatsByBaseTokenMint.get(poolTokenInfo?.address);

  const pageLoading =
    poolLoading ||
    tokensMapLoading ||
    aprLoading ||
    poolsStatsLoading ||
    rawNftsLoading;

  const loading = pageLoading;

  const { balance: poolTokenBalance } = useSplTokenBalance(
    poolTokenInfo?.address,
    9,
  );

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
      {loading ? (
        <Loader size="large" />
      ) : (
        <div className={styles.root}>
          <div className={styles.stakingWrapper}>
            <StakingDetails
              className={styles.stakingInfoInventory}
              title="Inventory Staking"
              infoText="Stake pool tokens without any risk but with reduced rewards"
              totalLiquidity="$ 123 456 789"
              apr="30.20 %"
            />
            <StakingDetails
              className={styles.stakingInfoLiquidity}
              title="Liquidity Staking"
              infoText="Stake LP tokens with high rewards but with risk of impermanent
              loss"
              totalLiquidity={`$ ${formatNumberWithSpaceSeparator(
                poolStats?.volume || 0,
              )}`}
              apr={`${liquidityAPR.toFixed(2)} %`}
              isRisky
            />
            {connected && (
              <>
                <InventoryWalletInfo
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokenBalance,
                  }}
                  onSellNft={() => {}}
                  sellNftAvailable={!!whitelistedNFTs?.length}
                  className={styles.inventoryWalletInfo}
                />
                <LiquidityWalletInfo
                  poolToken={{
                    ticker: poolTokenInfo?.symbol,
                    balance: poolTokenBalance,
                  }}
                  lpToken={{
                    ticker: `${poolTokenInfo?.symbol}/SOL`,
                    balance: 0,
                  }}
                  onSellNft={() => {}}
                  sellNftAvailable={!!whitelistedNFTs?.length}
                  className={styles.liquidityWalletInfo}
                />
                <p
                  className={classNames(
                    styles.subtitle,
                    styles.subtitleStaking,
                  )}
                >
                  Staking info
                </p>
                <StakingInfo className={styles.stakingInfo} />
                <RewardsInfo
                  className={styles.rewardsInfo}
                  values={['10 PUNKS', '20 rFRKT', '20 rFRKT']}
                />
              </>
            )}
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};

interface InventoryWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  sellNftAvailable?: boolean;
  onSellNft: () => void;
  className?: string;
}

const InventoryWalletInfo: FC<InventoryWalletInfoProps> = ({
  poolToken,
  sellNftAvailable = false,
  onSellNft,
  className,
}) => {
  return (
    <div className={className}>
      <p className={styles.subtitle}>Wallet info</p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={{ label: 'Stake rPWNG', action: () => {} }}
        secondAction={
          sellNftAvailable
            ? { label: 'Sell NFT & Stake', action: onSellNft }
            : null
        }
        className={styles.walletInfoInventory}
      />
    </div>
  );
};

interface LiquidityWalletInfoProps {
  poolToken: {
    ticker: string;
    balance: number;
  };
  lpToken?: {
    ticker: string;
    balance: number;
  };
  sellNftAvailable?: boolean;
  onSellNft: () => void;
  className?: string;
}

const LiquidityWalletInfo: FC<LiquidityWalletInfoProps> = ({
  poolToken,
  lpToken,
  sellNftAvailable = false,
  onSellNft,
  className,
}) => {
  return (
    <div className={classNames(styles.liquidityWalletInfoMain, className)}>
      <p className={classNames(styles.liquiditySubtitle, styles.subtitle)}>
        Wallet info
      </p>
      <WalletInfo
        title={poolToken?.ticker || 'Unknown'}
        balance={poolToken?.balance ? poolToken.balance.toFixed(3) : '0'}
        firstAction={{ label: 'Deposit', action: () => {} }}
        secondAction={
          sellNftAvailable
            ? { label: 'Sell NFT & Deposit', action: onSellNft }
            : null
        }
        className={styles.walletInfoLiquidity}
      />
      {!!lpToken && (
        <WalletInfo
          title={lpToken.ticker || 'Unknown'}
          balance={lpToken.balance ? lpToken.balance.toFixed(3) : '0'}
          firstAction={{ label: 'Stake', action: () => {} }}
          secondAction={{ label: 'Withdraw', action: () => {} }}
          className={styles.walletInfoLiquidityStaking}
        />
      )}
    </div>
  );
};
