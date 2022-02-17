import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { Collapse, Radio } from 'antd';
import { ControlledCheckbox } from '../../../../components/Checkbox/Checkbox';
import { ControlledRadio } from '../../../../components/CustomRadio/CustomRadio';
import { Controller } from 'react-hook-form';

const { Panel } = Collapse;

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
                <div className={styles.sidebarList}>
                  <Controller
                    control={control}
                    name={'showVaultsStatus'}
                    render={({ field: { onChange, value, ...field } }) => (
                      <Radio.Group
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                      >
                        <div className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showActiveVaults'}
                            label={'Active'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showAuctionLiveVaults'}
                            label={'Auction live'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showAuctionFinishedVaults'}
                            label={'Auction finished'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <ControlledRadio
                            value={'showArchivedVaults'}
                            label={'Archived'}
                            {...field}
                          />
                        </div>
                      </Radio.Group>
                    )}
                  />
                </div>
              </Radio.Group>
            </Panel>
          </Collapse>
        </div>
      </div>
    </>
  );
};
