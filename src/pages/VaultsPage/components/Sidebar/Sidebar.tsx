import { FC, useState } from 'react';
import classNames from 'classnames';
import { Control, Controller } from 'react-hook-form';
import { Collapse, Radio, RadioChangeEvent } from 'antd';

import styles from './styles.module.scss';
import CustomCheckbox from '../../../../components/Checkbox/Checkbox';
import { CustomRadio } from '../../../../components/CustomRadio';
import {
  FormFieldValues,
  SidebarCheckboxNames,
  StatusRadioNames,
} from '../../model';

const { Panel } = Collapse;

interface SidebarProps {
  isSidebar: boolean;
  control: Control<FormFieldValues>;
  setIsSidebar: (sidebarState: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  isSidebar,
  setIsSidebar,
  control,
}) => {
  const showSidebar = () => setIsSidebar(true);
  const hideSidebar = () => setIsSidebar(false);

  const [currentRadio, setCurrentRadio] = useState<string>(
    StatusRadioNames.SHOW_ACTIVE_VAULTS,
  );

  const changeRadio = (event: RadioChangeEvent) => {
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
                  <Controller
                    control={control}
                    name={SidebarCheckboxNames.SHOW_VERIFIED_VAULTS}
                    render={({ field: { ref, ...field } }) => {
                      return (
                        <CustomCheckbox {...field} label={'Verified only'} />
                      );
                    }}
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
                  <Controller
                    control={control}
                    name={SidebarCheckboxNames.SHOW_TRADABLE_VAULTS}
                    render={({ field: { ref, ...field } }) => {
                      return (
                        <CustomCheckbox {...field} label={'Tradable only'} />
                      );
                    }}
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
                          <CustomRadio
                            value={StatusRadioNames.SHOW_ACTIVE_VAULTS}
                            label={'Active'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <CustomRadio
                            value={StatusRadioNames.SHOW_AUCTION_LIVE_VAULTS}
                            label={'Auction live'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <CustomRadio
                            value={
                              StatusRadioNames.SHOW_AUCTION_FINISHED_VAULTS
                            }
                            label={'Auction finished'}
                            {...field}
                          />
                        </div>
                        <div className={styles.sidebarListItem}>
                          <CustomRadio
                            value={StatusRadioNames.SHOW_ARCHIVED_VAULTS}
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
