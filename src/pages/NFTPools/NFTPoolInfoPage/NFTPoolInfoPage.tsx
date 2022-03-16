import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import styles from './NFTPoolInfoPage.module.scss';
import { HeaderInfo } from './components/HeaderInfo';
import { SolanaIcon } from '../../../icons';
import { POOL_HISTORY_DATA } from './tempData';
import { HistoryListItem } from './components/HistoryListItem';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import {
  useNftPool,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { Loader } from '../../../components/Loader';

export const NFTPoolInfoPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { loading: poolLoading } = useNftPool(poolPubkey);

  const loading = poolLoading;

  const Header = () => <HeaderInfo poolPublicKey={poolPubkey} />;

  return (
    <NFTPoolPageLayout CustomHeader={loading ? null : Header}>
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
              {POOL_HISTORY_DATA.map((item) => (
                <HistoryListItem key={item.itemId} itemData={item} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </NFTPoolPageLayout>
  );
};
