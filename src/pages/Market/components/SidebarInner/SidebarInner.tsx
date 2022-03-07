import { FC } from 'react';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';

import styles from './SidebarInner.module.scss';
import { /*Checkbox, Collapse, */ Input } from 'antd';

// const { Panel } = Collapse;

// const tempItemBg =
//   'https://www.arweave.net/TUCIGroXreLVvKxdBhSBG_pq8jEyl_IWXyEIwR8Ue5Y';

// const COLLECTIONS_IN_POOL_DATA = [
//   { name: 'PLSTTY', items: 2 },
//   { name: 'Moments', items: 5 },
// ];

// const FILTERS_DATA = [
//   { name: 'Famale', items: 123 },
//   { name: 'Male', items: 123 },
// ];

// const shortName = (name: string, maxLength: number) =>
//   name.length > maxLength ? `${name.slice(0, maxLength - 2)} ...` : name;

interface SidebarInnerProps {
  setIsSidebar: (sidebarState: boolean) => void;
  isSidebar: boolean;
  setSearch: (value: string) => void;
}

export const SidebarInner: FC<SidebarInnerProps> = ({
  isSidebar,
  setIsSidebar,
  setSearch,
}) => {
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
          onChange={(event) => setSearch(event?.currentTarget?.value || '')}
        />
        {/* //TODO Step filters here */}
        {/* <div className={styles.sidebarItem}>
          <h6 className={styles.sidebarTitle}>
            <span>collections in pool</span>
            <span>385</span>
          </h6>
          <ul className={styles.sidebarList}>
            {COLLECTIONS_IN_POOL_DATA.map((item, index) => (
              <li className={styles.sidebarListItem} key={item.name + index}>
                <Checkbox className={styles.sidebarItemName}>
                  {shortName(item.name, 9)}
                </Checkbox>
                <span className={styles.sidebarItemAmount}>
                  {item.items} items
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.chosenItemWrapper}>
            <div className={styles.chosenItem}>
              <div
                className={styles.chosenImage}
                style={{ backgroundImage: `url(${tempItemBg})` }}
              />
              <div className={styles.chosenInfo}>
                <p className={styles.chosenName}>Cryptopunks</p>
                <p className={styles.chosenItemsAmount}>{2} items</p>
              </div>
            </div>
            <div className={styles.chosenFilter}>
              <Collapse collapsible="header" className={styles.collapse}>
                <Panel
                  header="character"
                  key="1"
                  className={styles.collapseHeader}
                >
                  <ul className={styles.sidebarList}>
                    {FILTERS_DATA.map((item, index) => (
                      <li
                        className={styles.sidebarListItem}
                        key={item.name + index}
                      >
                        <Checkbox className={styles.sidebarItemName}>
                          {shortName(item.name, 9)}
                        </Checkbox>
                        <span className={styles.sidebarItemAmount}>
                          {item.items}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};
