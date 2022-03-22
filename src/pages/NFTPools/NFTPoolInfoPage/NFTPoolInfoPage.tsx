import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import styles from './NFTPoolInfoPage.module.scss';
import { HeaderInfo } from './components/HeaderInfo';
import { SolanaIcon } from '../../../icons';
import { POOL_HISTORY_DATA } from './tempData';
import { HistoryListItem } from './components/HistoryListItem';
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

export const NFTPoolInfoPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const loading = poolLoading || tokensMapLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderInfo
          poolPublicKey={poolPubkey}
          poolTokenInfo={poolTokenInfo}
          hidden={loading}
        />
      }
      pageType={PoolPageType.INFO}
    >
      {loading ? (
        <Loader size="large" />
      ) : (
        <div className={styles.root}>
          <div className={styles.leftSide}>
            <div className={styles.priceWrapper}>
              <h5 className={styles.cardTitle}>Price</h5>
              <ul className={styles.priceList}>
                <li
                  className={classNames(styles.priceItem, styles.priceItemBuy)}
                >
                  <p>Buy price</p>
                  <span>{0.002124}</span>
                  <SolanaIcon /> SOL
                </li>
                <li
                  className={classNames(styles.priceItem, styles.priceItemMid)}
                >
                  <p>mid price</p>
                  <span>{0.002124}</span>
                  <SolanaIcon /> SOL
                </li>
                <li
                  className={classNames(styles.priceItem, styles.priceItemSell)}
                >
                  <p>sell price</p>
                  <span>{0.002124}</span>
                  <SolanaIcon /> SOL
                </li>
              </ul>
            </div>
            <div className={styles.additionalInfo}>
              <div className={styles.additionalItem}>
                <h5 className={styles.cardTitle}>Volume</h5>
                <p className={styles.additionalContent}>
                  <span>{0.002124}</span>
                  <SolanaIcon /> SOL
                </p>
              </div>
              <div className={styles.additionalItem}>
                <h5 className={styles.cardTitle}>APY</h5>
                <p className={styles.additionalContent}>
                  <span>{12.112}</span> %
                </p>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <h5 className={styles.cardTitle}>Pool history</h5>
            <ul className={styles.historyList}>
              <li className={styles.historyHeader}>
                <div className={styles.historyCell}>
                  <span>item</span>
                </div>
                <div className={styles.historyCell}>
                  <span>items id</span>
                </div>
                <div className={styles.historyCell}>
                  <span>action</span>
                </div>
                <div className={styles.historyCell}>
                  <span>price</span>
                </div>
                <div className={styles.historyCell}>
                  <span>date</span>
                </div>
              </li>
              {POOL_HISTORY_DATA.map((item, idx) => (
                <HistoryListItem key={idx} itemData={item} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};
