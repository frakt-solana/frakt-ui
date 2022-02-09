import React, { FC } from 'react';
import classNames from 'classnames';
import styles from '../../styles.module.scss';
import { SolanaIcon, SwapIcon } from '../../../../icons';

interface HistoryListItemProps {
  itemData: any;
}

export const HistoryListItem: FC<HistoryListItemProps> = ({
  itemData: { itemImage, itemImage2, itemId, nftName, action, price, date },
}) => {
  const actionSwap = action === 'swap';
  return (
    <li className={classNames(styles.historyItem, styles[action])}>
      <div className={styles.historyCell}>
        <div
          className={styles.historyImage}
          style={{
            backgroundImage: `url(${
              itemImage2 && itemImage2
            }), url(${itemImage})`,
          }}
        />
      </div>
      <div
        className={classNames(styles.historyCell, {
          [styles.swapCell]: actionSwap,
        })}
      >
        <p className={styles.historyId}>{itemId}</p>
        {actionSwap && (
          <>
            <SwapIcon width={8} />
            <p className={styles.historyId}>{nftName}</p>
          </>
        )}
      </div>
      <div className={styles.historyCell}>
        <p className={styles.historyAction}>{action}</p>
      </div>
      <div className={styles.historyCell}>
        <p className={styles.historyPrice}>
          <span>{price}</span>
          <SolanaIcon /> SOL
        </p>
      </div>
      <div className={styles.historyCell}>
        <p className={styles.historyDate}>{date}</p>
      </div>
    </li>
  );
};
