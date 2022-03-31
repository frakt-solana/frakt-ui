import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';

import styles from './NFTPoolInfoPage.module.scss';
import { HeaderInfo } from './components/HeaderInfo';
import { SolanaIcon } from '../../../icons';
import { usePublicKeyParam } from '../../../hooks';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import {
  useNftPool,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { Loader } from '../../../components/Loader';
import { useTokenListContext } from '../../../contexts/TokenList';
import { LinkWithArrow } from '../../../components/LinkWithArrow';
import { PATHS } from '../../../constants';
import {
  Price,
  useAPR,
  useNftPoolTokenBalance,
  usePoolTokensPrices,
} from '../hooks';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { PoolStats, useCachedPoolsStats } from '../../PoolsPage';
import { formatNumberWithSpaceSeparator } from '../../../contexts/liquidityPools';

export const NFTPoolInfoPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { connected } = useWallet();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const { poolsStatsByBaseTokenMint, loading: poolsStatsLoading } =
    useCachedPoolsStats();

  const poolStats = poolsStatsByBaseTokenMint.get(poolTokenInfo?.address);

  const poolTokenPrice = poolTokenPricesByTokenMint.get(poolTokenInfo?.address);

  const { balance: userPoolTokenBalance } = useNftPoolTokenBalance(pool);

  const { loading: aprLoading } = useAPR();

  const pageLoading = poolLoading || tokensMapLoading || aprLoading;

  const loading = pageLoading || pricesLoading || poolsStatsLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderInfo
          poolPublicKey={poolPubkey}
          poolTokenInfo={poolTokenInfo}
          hidden={pageLoading}
        />
      }
      pageType={PoolPageType.INFO}
    >
      {loading ? (
        <Loader size="large" />
      ) : (
        <div className={styles.root}>
          {!!poolTokenPrice && !!poolTokenInfo && (
            <PriceSection price={poolTokenPrice} />
          )}

          {<LiquiditySection poolStats={poolStats} />}

          {connected && !!poolTokenInfo && (
            <UserBalanceSection
              balance={userPoolTokenBalance}
              tokenInfo={poolTokenInfo}
            />
          )}
        </div>
      )}
    </NFTPoolPageLayout>
  );
};

interface UserBalanceSectionProps {
  balance?: number;
  tokenInfo: TokenInfo;
}

const UserBalanceSection: FC<UserBalanceSectionProps> = ({
  balance = 0,
  tokenInfo,
}) => {
  return (
    <div className={styles.balanceWrapper}>
      <h5 className={styles.cardTitle}>Your balance</h5>
      <PriceSOL price={balance?.toFixed(3)} customToken={tokenInfo} />
    </div>
  );
};

interface LiquiditySectionProps {
  poolStats: PoolStats;
}

const LiquiditySection: FC<LiquiditySectionProps> = ({ poolStats }) => {
  return (
    <div className={styles.liquidityWrapper}>
      <h5 className={styles.cardTitle}>Liquidity</h5>
      <p className={styles.liquiditySubtitle}>Volume</p>
      <p>$ {formatNumberWithSpaceSeparator(poolStats?.volume || 0)}</p>
      <LinkWithArrow
        to={`${PATHS.EARN}`}
        label="Earn"
        className={styles.liquidityLink}
      />
    </div>
  );
};

interface PriceSectionProps {
  price: Price;
}

const PriceSection: FC<PriceSectionProps> = ({ price }) => {
  const buyPrice = parseFloat(price.buy)?.toFixed(3);
  const sellPrice = (
    parseFloat(price.sell) *
    ((100 - SELL_COMMISSION_PERCENT) / 100)
  )?.toFixed(3);
  const swapPrice = (
    parseFloat(price.buy) *
    (SELL_COMMISSION_PERCENT / 100)
  )?.toFixed(3);

  return (
    <div className={styles.priceWrapper}>
      <h5 className={styles.cardTitle}>Price</h5>
      <ul className={styles.priceList}>
        <li className={classNames(styles.priceItem, styles.priceItemBuy)}>
          <p
            className={classNames(
              styles.priceItemTitle,
              styles.priceItemTitleBuy,
            )}
          >
            Buy price
          </p>
          <PriceSOL price={buyPrice} />
        </li>
        <li className={classNames(styles.priceItem, styles.priceItemSell)}>
          <p
            className={classNames(
              styles.priceItemTitle,
              styles.priceItemTitleSell,
            )}
          >
            Sell price
          </p>
          <PriceSOL price={sellPrice} />
        </li>
        <li className={classNames(styles.priceItem, styles.priceItemSwap)}>
          <p
            className={classNames(
              styles.priceItemTitle,
              styles.priceItemTitleSwap,
            )}
          >
            Swap price
          </p>
          <PriceSOL price={swapPrice} />
        </li>
      </ul>
    </div>
  );
};

interface PriceSOLProps {
  price: string;
  customToken?: TokenInfo;
  className?: string;
}

const PriceSOL: FC<PriceSOLProps> = ({ price, className, customToken }) => {
  return (
    <div className={classNames(styles.solPriceWrapper, className)}>
      <span className={styles.solPrice}>{price}</span>
      {customToken ? (
        <>
          <div
            className={styles.tokenPriceIcon}
            style={{ backgroundImage: `url(${customToken?.logoURI})` }}
          />{' '}
          {customToken?.symbol}
        </>
      ) : (
        <>
          <SolanaIcon className={styles.solPriceIcon} /> SOL
        </>
      )}
    </div>
  );
};
