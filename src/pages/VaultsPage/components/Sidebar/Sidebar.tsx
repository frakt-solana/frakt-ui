import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { Checkbox, Collapse, Radio } from 'antd';
import { ControlledCheckbox } from '../../../../components/Checkbox/Checkbox';
import { ControlledRadio } from '../../../../components/CustomRadio/CustomRadio';
import { Controller } from 'react-hook-form';
import Toggle from '../../../../components/Toggle';

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

  const [currentRadio, setCurrentRadio] = useState<string>('showActiveVaults');

  const changeRadio = (event) => {
    setCurrentRadio(event.target.value);
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
                    label={'Tradable only'}
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
            <Panel header="Status" key="1" className={styles.collapseHeader}>
              <Radio.Group
                className={styles.sidebarList}
                onChange={changeRadio}
                value={currentRadio}
              >
                <ul className={styles.sidebarList}>
                  <Controller
                    control={control}
                    name={'showVaultsStatus'}
                    render={({ field: { onChange, value, ...field } }) => (
                      <Radio.Group
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                      >
                        <li className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showActiveVaults'}
                            label={'Active'}
                            {...field}
                          />
                          <span className={styles.sidebarItemAmount}>
                            {123}
                          </span>
                        </li>
                        <li className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showAuctionLiveVaults'}
                            label={'Auction live'}
                            {...field}
                          />
                          <span className={styles.sidebarItemAmount}>
                            {123}
                          </span>
                        </li>
                        <li className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showAuctionFinishedVaults'}
                            label={'Auction finished'}
                            {...field}
                          />
                          <span className={styles.sidebarItemAmount}>
                            {123}
                          </span>
                        </li>
                        <li className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showArchivedVaults'}
                            label={'Archived'}
                            {...field}
                          />
                          <span className={styles.sidebarItemAmount}>
                            {123}
                          </span>
                        </li>
                      </Radio.Group>
                    )}
                  />
                </ul>
              </Radio.Group>
            </Panel>
          </Collapse>
        </div>
      </div>
    </>
  );
};
