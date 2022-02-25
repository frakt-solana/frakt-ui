import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { createMarketPoolLink, MARKET_TABS } from '../../../../constants';
import { BuyIcon, InfoIcon, SellIcon, SwapMarketIcon } from '../../../../icons';
import styles from './styles.module.scss';

interface HeaderBuyProps {
  className?: string;
  poolPublicKey: string;
}

export const MarketNavigation: FC<HeaderBuyProps> = ({
  className,
  poolPublicKey,
}) => {
  return (
    <ul className={classNames(styles.navigation, className)}>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createMarketPoolLink(MARKET_TABS.BUY, poolPublicKey)}
        >
          <BuyIcon className={styles.navIcon} />
          Buy
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createMarketPoolLink(MARKET_TABS.SELL, poolPublicKey)}
        >
          <SellIcon className={styles.navIcon} />
          Sell
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createMarketPoolLink(MARKET_TABS.SWAP, poolPublicKey)}
        >
          <SwapMarketIcon className={styles.navIcon} />
          Swap
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={createMarketPoolLink(MARKET_TABS.INFO, poolPublicKey)}
        >
          <InfoIcon className={styles.navIcon} />
          Info
        </NavLink>
      </li>
    </ul>
  );
};
