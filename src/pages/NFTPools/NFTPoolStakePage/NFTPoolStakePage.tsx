// import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC, useMemo } from 'react';

import { Loader } from '../../../components/Loader';
import { POOL_TABS } from '../../../constants';
import {
  useNftPool,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { useTokenListContext } from '../../../contexts/TokenList';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useAPR, usePoolPubkeyParam } from '../hooks';
import { HeaderInfo } from '../NFTPoolInfoPage/components/HeaderInfo';
import {
  StakingInfo,
  WalletInfoBalance,
  // WalletInfoBalanceProps,
  WalletInfoButton,
  WalletInfoWrapper,
} from './components';
import styles from './NFTPoolStakePage.module.scss';

export const NFTPoolStakePage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  // const { connected } = useWallet();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const { loading: aprLoading } = useAPR();

  const pageLoading = poolLoading || tokensMapLoading || aprLoading;

  const loading = pageLoading;

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
            <StakingInfo
              className={styles.stakingInfoInventory}
              title="Inventory Staking"
              infoText="Stake pool tokens without any risk but with reduced rewards"
              totalLiquidity="$ 123 456 789"
              apr="30.20 %"
            />
            <StakingInfo
              className={styles.stakingInfoLiquidity}
              title="Liquidity Staking"
              infoText="Stake LP tokens with high rewards but with risk of impermanent
              loss"
              totalLiquidity="$ 123 456 789"
              apr="210.32 %"
              isRisky
            />
            <p
              className={classNames(
                styles.subtitle,
                styles.subtitleWalletInfoInventory,
              )}
            >
              Wallet info
            </p>
            <p
              className={classNames(
                styles.subtitle,
                styles.subtitleWalletInfoLiquidity,
              )}
            >
              Wallet info
            </p>
            <WalletInfo
              title="rPWNG"
              balance="10.003"
              firstAction={{ label: 'Stake rPWNG', action: () => {} }}
              secondAction={{ label: 'Sell NFT & Stake', action: () => {} }}
              className={styles.walletInfoInventory}
            />
            <WalletInfo
              title="rPWNG"
              balance="10.003"
              firstAction={{ label: 'Deposit', action: () => {} }}
              secondAction={{ label: 'Sell NFT & Deposit', action: () => {} }}
              className={styles.walletInfoLiquidity}
            />
            <WalletInfo
              title="rPWNG/SOL"
              balance="10.003"
              firstAction={{ label: 'Stake', action: () => {} }}
              secondAction={{ label: 'Withdraw', action: () => {} }}
              className={styles.walletInfoLiquidityStaking}
            />
            <p className={classNames(styles.subtitle, styles.subtitleStaking)}>
              Staking info
            </p>
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};

interface Action {
  label: string;
  action: () => void;
}

interface WalletInfoProps {
  title: string;
  balance: string;
  firstAction: Action;
  secondAction?: Action;
  className?: string;
}

export const WalletInfo: FC<WalletInfoProps> = ({
  title,
  balance,
  firstAction,
  secondAction,
  className,
}) => {
  return (
    <WalletInfoWrapper className={className}>
      <WalletInfoBalance title={title} values={[balance]} />
      <div className={styles.walletInfoBtnWrapper}>
        <WalletInfoButton
          className={styles.walletInfoBtn}
          onClick={firstAction.action}
        >
          {firstAction.label}
        </WalletInfoButton>
        {secondAction && (
          <WalletInfoButton
            className={styles.walletInfoBtn}
            onClick={secondAction.action}
          >
            {secondAction.label}
          </WalletInfoButton>
        )}
      </div>
    </WalletInfoWrapper>
  );
};
