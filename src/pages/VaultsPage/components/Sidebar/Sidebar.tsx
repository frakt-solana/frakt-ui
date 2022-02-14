import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { Checkbox, Collapse, Radio } from 'antd';
import { ControlledCheckbox } from '../../../../components/Checkbox/Checkbox';
import { ControlledRadio } from '../../../../components/CustomRadio/CustomRadio';

const { Panel } = Collapse;

const tempItemBg =
  'https://www.arweave.net/TUCIGroXreLVvKxdBhSBG_pq8jEyl_IWXyEIwR8Ue5Y';

const COLLECTIONS_IN_POOL_DATA = [
  { name: 'monkeys', items: 123 },
  { name: 'cryptopunk', items: 123 },
  { name: 'monkeys', items: 123 },
  { name: 'monkeys', items: 123 },
  { name: 'monkeys', items: 123 },
];

const FILTERS_DATA = [
  { name: 'Famale', items: 123 },
  { name: 'Male', items: 123 },
];

const shortName = (name: string, maxLength: number) =>
  name.length > maxLength ? `${name.slice(0, maxLength - 2)} ...` : name;

interface SidebarProps {
  isSidebar: boolean;
  control: any;
  setIsSidebar: (sidebarState: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  isSidebar,
  setIsSidebar,
  control,
}) => {
  const showSidebar = () => setIsSidebar(true);
  const hideSidebar = () => setIsSidebar(false);

  const [currentRadio, setCurrentRadio] = useState<number>(1);

  const changeRadio = () => (event) => {
    setCurrentRadio(event.current?.value);
  };

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
        <div className={styles.filterList}>
          <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            className={styles.collapse}
          >
            <Panel
              header="verification"
              key="1"
              className={styles.collapseHeader}
            >
              <ul className={styles.sidebarList}>
                <li className={styles.sidebarListItem}>
                  <ControlledCheckbox
                    control={control}
                    name={'showVerifiedVaults'}
                    label={'Verified only'}
                  />
                  <span className={styles.sidebarItemAmount}>{123}</span>
                </li>
              </ul>
            </Panel>
          </Collapse>
        </div>
        <div className={styles.filterList}>
          <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            className={styles.collapse}
          >
            <Panel header="tradable" key="1" className={styles.collapseHeader}>
              <ul className={styles.sidebarList}>
                <li className={styles.sidebarListItem}>
                  <ControlledCheckbox
                    control={control}
                    name={'showTradableVaults'}
                    label={'tradable'}
                  />
                  <span className={styles.sidebarItemAmount}>{123}</span>
                </li>
              </ul>
            </Panel>
          </Collapse>
        </div>
        <div className={styles.filterList}>
          <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            className={styles.collapse}
          >
            <Panel header="tradable" key="1" className={styles.collapseHeader}>
              <Radio.Group
                className={styles.sidebarList}
                onChange={changeRadio()}
                value={currentRadio}
              >
                <ul className={styles.sidebarList}>
                  <li className={styles.sidebarListItem}>
                    <ControlledRadio
                      control={control}
                      name={'showActiveVaults'}
                      label={'Active'}
                      value={1}
                    />
                    <span className={styles.sidebarItemAmount}>{123}</span>
                  </li>
                  <li className={styles.sidebarListItem}>
                    <ControlledRadio
                      control={control}
                      name={'showAuctionLiveVaults'}
                      label={'Auction live'}
                      value={2}
                    />
                    <span className={styles.sidebarItemAmount}>{123}</span>
                  </li>
                  <li className={styles.sidebarListItem}>
                    <ControlledRadio
                      control={control}
                      name={'showAuctionFinishedVaults'}
                      label={'Auction finished'}
                      value={3}
                    />
                    <span className={styles.sidebarItemAmount}>{123}</span>
                  </li>
                  <li className={styles.sidebarListItem}>
                    <ControlledRadio
                      control={control}
                      name={'showArchivedVaults'}
                      label={'Archived'}
                      value={4}
                    />
                    <span className={styles.sidebarItemAmount}>{123}</span>
                  </li>
                </ul>
              </Radio.Group>
            </Panel>
          </Collapse>
        </div>
        <div className={styles.sidebarItem}>
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
                <p className={styles.chosenItemsAmount}>{385} items</p>
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
        </div>
      </div>
    </>
  );
};
