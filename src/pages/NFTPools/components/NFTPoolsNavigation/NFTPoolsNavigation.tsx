import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { createPoolLink, POOL_TABS } from '../../../../constants';
import { BuyIcon, InfoIcon, SellIcon, SwapMarketIcon } from '../../../../icons';
import styles from './NFTPoolsNavigation.module.scss';

interface HeaderBuyProps {
  className?: string;
  poolPublicKey: string;
}

export const NFTPoolsNavigation: FC<HeaderBuyProps> = ({
  className,
  poolPublicKey,
}) => {
  return (
    <ul className={classNames(styles.navigation, className)}>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(POOL_TABS.BUY, poolPublicKey)}
        >
          <BuyIcon className={styles.navIcon} />
          Buy
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(POOL_TABS.SELL, poolPublicKey)}
        >
          <SellIcon className={styles.navIcon} />
          Sell
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(POOL_TABS.SWAP, poolPublicKey)}
        >
          <SwapMarketIcon className={styles.navIcon} />
          Swap
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createPoolLink(POOL_TABS.INFO, poolPublicKey)}
        >
          <InfoIcon className={styles.navIcon} />
          Info
        </NavLink>
      </li>
    </ul>
  );
};
