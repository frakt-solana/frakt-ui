import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { ArrowRightTop, SwapIcon } from '../../../../../icons';

const TRENDING_DATA = [
  { name: 'mask1', percent: '45%' },
  { name: 'monkey', percent: '43%' },
  { name: 'punks', percent: '42%' },
  { name: 'yobidoyobiyobidoyobi', percent: '40%' },
  { name: 'mask', percent: '38%' },
];

const BEST_APRS_DATA = [
  { name: 'mask1', percent: '1 324.00%', image: '#' },
  { name: 'mask2', percent: '1 324.00%', image: '#' },
  { name: 'mask3', percent: '1 324.00%', image: '#' },
  { name: 'mask4', percent: '1 324.00%', image: '#' },
  { name: 'safdfsdasdf', percent: '1 324.00%', image: '#' },
];

const ACTIVITY_DATA = [
  { name: 'meeb #565', type: 'sell' },
  { name: 'meeb #56577576', type: 'buy' },
  { name: 'meeb #565775762', type: 'buy' },
  { name: 'meeb #565775763', type: 'buy' },
  { name: 'BIG PUNK WITH Something', name2: 'meeb #56577557', type: 'swap' },
];

const shortName = (name: string, maxLength: number) =>
  name.length > maxLength ? `${name.slice(0, maxLength - 2)} ...` : name;

export const Sidebar: FC = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const showSidebar = () => setIsSidebar(true);
  const hideSidebar = () => setIsSidebar(false);

  return (
    <>
      <div
        onClick={hideSidebar}
        onTouchMove={hideSidebar}
        className={classNames({
          [styles.overlay]: true,
          [styles.overlayVisible]: isSidebar,
        })}
      />
      <div
        onTouchMove={showSidebar}
        onClick={showSidebar}
        className={classNames({
          [styles.sidebar]: true,
          [styles.sidebarVisible]: isSidebar,
        })}
      >
        <div className={styles.sidebarItem}>
          <h6 className={styles.sidebarTitle}>trending</h6>
          <span className={styles.sidebarSubtitle}>(7d turnover)</span>
          <ul className={styles.sidebarList}>
            {TRENDING_DATA.map((item, index) => (
              <li
                className={styles.sidebarListItem}
                key={item.name + item.percent}
              >
                <span className={styles.sidebarItemNum}>{index + 1}</span>
                <span className={styles.sidebarItemName}>
                  {shortName(item.name, 11)}
                </span>
                <span className={styles.sidebarItemData}>{item.percent}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.sidebarItem}>
          <h6 className={styles.sidebarTitle}>activity</h6>
          <ul className={styles.sidebarListBorder}>
            {ACTIVITY_DATA.map((item) => (
              <li
                className={classNames(
                  styles.sidebarActivityListItem,
                  styles[item.type],
                )}
                key={item.name + item.type}
              >
                {item.type === 'swap' ? (
                  <>
                    <div className={styles.swapItems}>
                      <span className={styles.sidebarItemName}>
                        {shortName(item.name, 15)}
                      </span>
                      <SwapIcon />
                      <span className={styles.sidebarItemName}>
                        {shortName(item.name2, 15)}
                      </span>
                    </div>
                    <span className={styles.typeLabel}>{item.type}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.sidebarItemName}>
                      {shortName(item.name, 15)}
                    </span>
                    <span className={styles.typeLabel}>{item.type}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <NavLink to={`/`} className={styles.seeMoreLink}>
            See More <ArrowRightTop />
          </NavLink>
        </div>

        <div className={styles.sidebarItem}>
          <h6 className={styles.sidebarTitle}>
            best apr<span>s</span>
          </h6>
          <ul className={styles.sidebarList}>
            {BEST_APRS_DATA.map((item) => (
              <li className={styles.sidebarListItem} key={item.name}>
                <div
                  className={styles.sidebarItemImg}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <span className={styles.sidebarItemName}>
                  {shortName(item.name, 8)}
                </span>
                <span className={styles.sidebarItemData}>{item.percent}</span>
              </li>
            ))}
          </ul>
          <NavLink to={`/`} className={styles.seeMoreLink}>
            See More <ArrowRightTop />
          </NavLink>
        </div>
      </div>
    </>
  );
};
