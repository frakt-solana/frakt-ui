import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { createPoolLink, POOL_TABS } from '../../../../constants';
import { BuyIcon, InfoIcon, SellIcon, SwapMarketIcon } from '../../../../icons';
import styles from './NFTPoolsNavigation.module.scss';
import { NftPoolData } from '../../../../utils/cacher/nftPools';

interface HeaderBuyProps {
  className?: string;
  pool: NftPoolData;
}

export const NFTPoolsNavigation: FC<HeaderBuyProps> = ({ className, pool }) => {
  return (
    <ul className={classNames(styles.navigation, className)}>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(
            POOL_TABS.BUY,
            pool?.customName || pool?.publicKey?.toBase58(),
          )}
        >
          <BuyIcon className={styles.navIcon} />
          Buy
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(
            POOL_TABS.SELL,
            pool?.customName || pool?.publicKey?.toBase58(),
          )}
        >
          <SellIcon className={styles.navIcon} />
          Sell
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(
            POOL_TABS.SWAP,
            pool?.customName || pool?.publicKey?.toBase58(),
          )}
        >
          <SwapMarketIcon className={styles.navIcon} />
          Swap
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(
            POOL_TABS.INFO,
            pool?.customName || pool?.publicKey?.toBase58(),
          )}
        >
          <InfoIcon className={styles.navIcon} />
          Info
        </NavLink>
      </li>
    </ul>
  );
};
