import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const COLLECTIONS_IN_POOL_DATA = [
  { name: 'monkeys', items: 123 },
  { name: 'cryptopunk', items: 123 },
  { name: 'monkeys', items: 123 },
  { name: 'monkeys', items: 123 },
  { name: 'monkeys', items: 123 },
];

const shortName = (name: string, maxLength: number) =>
  name.length > maxLength ? `${name.slice(0, maxLength - 2)} ...` : name;

interface SidebarProps {
  setIsSidebar: (sidebarState: boolean) => void;
  isSidebar: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ isSidebar, setIsSidebar }) => {
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
        <Input
          className={styles.searchInput}
          placeholder="Search for ID"
          prefix={<SearchOutlined className={styles.searchIcon} />}
        />
        <div className={styles.sidebarItem}>
          <h6 className={styles.sidebarTitle}>
            <span>collections in pool</span>
            <span>385</span>
          </h6>
          <ul className={styles.sidebarList}>
            {COLLECTIONS_IN_POOL_DATA.map((item, index) => (
              <li className={styles.sidebarListItem} key={item.name + index}>
                <div className={styles.sidebarItemCheckbox} />
                <span className={styles.sidebarItemName}>
                  {shortName(item.name, 9)}
                </span>
                <span className={styles.sidebarItemAmount}>
                  {item.items} items
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
