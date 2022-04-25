import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { createPoolLink, POOL_TABS } from '../../../../constants';
import {
  BuyIcon,
  InfoIcon,
  SellIcon,
  StakeIcon,
  SwapMarketIcon,
} from '../../../../icons';
import styles from './NFTPoolsNavigation.module.scss';
import { NftPoolData } from '../../../../utils/cacher/nftPools';

interface HeaderBuyProps {
  className?: string;
  pool: NftPoolData;
}

const POOL_LINKS = [
  {
    label: 'Buy',
    tab: POOL_TABS.BUY,
    icon: BuyIcon,
  },
  {
    label: 'Sell',
    tab: POOL_TABS.SELL,
    icon: SellIcon,
  },
  {
    label: 'Swap',
    tab: POOL_TABS.SWAP,
    icon: SwapMarketIcon,
  },
  {
    label: 'Stake',
    tab: POOL_TABS.STAKE,
    icon: StakeIcon,
  },
  {
    label: 'Info',
    tab: POOL_TABS.INFO,
    icon: InfoIcon,
  },
];

export const NFTPoolsNavigation: FC<HeaderBuyProps> = ({ className, pool }) => {
  return (
    <ul className={classNames(styles.navigation, className)}>
      {POOL_LINKS.map(({ label, tab, icon: Icon }, idx) => (
        <li key={idx} className={styles.item}>
          <NavLink
            activeClassName={styles.activeLink}
            className={styles.link}
            to={createPoolLink(
              tab,
              pool?.customName || pool?.publicKey?.toBase58(),
            )}
          >
            <Icon className={styles.navIcon} />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
