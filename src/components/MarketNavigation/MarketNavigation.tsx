import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';
import { URLS } from '../../constants';
import classNames from 'classnames';
import { BuyIcon, InfoIcon, SellIcon, SwapMarketIcon } from '../../icons';

interface HeaderBuyProps {
  className?: string;
}

export const MarketNavigation: FC<HeaderBuyProps> = ({ className }) => {
  return (
    <ul className={classNames(styles.navigation, className)}>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={URLS.MARKET_BUY}
        >
          <BuyIcon className={styles.navIcon} />
          Buy
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={URLS.MARKET_SELL}
        >
          <SellIcon className={styles.navIcon} />
          Sell
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={URLS.MARKET_SWAP}
        >
          <SwapMarketIcon className={styles.navIcon} />
          Swap
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          activeClassName={styles.activeLink}
          className={styles.link}
          to={URLS.MARKET_INFO}
        >
          <InfoIcon className={styles.navIcon} />
          Info
        </NavLink>
      </li>
    </ul>
  );
};
