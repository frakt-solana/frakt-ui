import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { HeaderInfo } from './components/HeaderInfo';
import { SolanaIcon } from '../../../icons';
import { POOL_HISTORY_DATA } from './tempData';
import { HistoryListItem } from './components/HistoryListItem';
import { usePublicKeyParam } from '../../../hooks';

export const MarketInfoPage = (): JSX.Element => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  const { connected } = useWallet();

  return (
    <AppLayout className={styles.layout}>
      <div className="container">
        <Helmet>
          <title>{`Market/Info | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
        </Helmet>
        <HeaderInfo poolPublicKey={poolPubkey} />
        {!connected ? (
          <WalletNotConnected className={styles.notConnected} />
        ) : (
          <>
            <div className={styles.wrapper}>
              <div className={styles.leftSide}>
                <div className={styles.priceWrapper}>
                  <h5 className={styles.cardTitle}>Price</h5>
                  <ul className={styles.priceList}>
                    <li
                      className={classNames(
                        styles.priceItem,
                        styles.priceItemBuy,
                      )}
                    >
                      <p>Buy price</p>
                      <span>{0.002124}</span>
                      <SolanaIcon /> SOL
                    </li>
                    <li
                      className={classNames(
                        styles.priceItem,
                        styles.priceItemMid,
                      )}
                    >
                      <p>mid price</p>
                      <span>{0.002124}</span>
                      <SolanaIcon /> SOL
                    </li>
                    <li
                      className={classNames(
                        styles.priceItem,
                        styles.priceItemSell,
                      )}
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
          </>
        )}
      </div>
    </AppLayout>
  );
};
