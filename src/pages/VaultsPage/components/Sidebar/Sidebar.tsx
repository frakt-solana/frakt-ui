import { FC, useState } from 'react';
import classNames from 'classnames';
import { Control, Controller } from 'react-hook-form';
import { Collapse, Radio as RadioAntd, RadioChangeEvent } from 'antd';

import styles from './Sidebar.module.scss';
import { Checkbox } from '../../../../components/Checkbox/Checkbox';
import { Radio } from '../../../../components/Radio';
import {
  FormFieldValues,
  InputControlsNames,
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
            defaultActiveKey={[InputControlsNames.SHOW_VERIFIED_VAULTS]}
            className={styles.collapse}
          >
            <Panel
              header="Verification"
              key={InputControlsNames.SHOW_VERIFIED_VAULTS}
              className={styles.collapseHeader}
            >
              <ul className={styles.sidebarList}>
                <li className={styles.sidebarListItem}>
                  <Controller
                    control={control}
                    name={SidebarCheckboxNames.SHOW_VERIFIED_VAULTS}
                    render={({ field: { ref, ...field } }) => (
                      <Checkbox {...field} label="Verified only" />
                    )}
                  />
                </li>
              </ul>
            </Panel>
          </Collapse>
        </div>
        <div className={styles.filterList}>
          <Collapse
            collapsible="header"
            defaultActiveKey={[InputControlsNames.SHOW_TRADABLE_VAULTS]}
            className={styles.collapse}
          >
            <Panel
              header="Tradable"
              key={InputControlsNames.SHOW_TRADABLE_VAULTS}
              className={styles.collapseHeader}
            >
              <ul className={styles.sidebarList}>
                <li className={styles.sidebarListItem}>
                  <Controller
                    control={control}
                    name={SidebarCheckboxNames.SHOW_TRADABLE_VAULTS}
                    render={({ field: { ref, ...field } }) => (
                      <Checkbox {...field} label="Tradable only" />
                    )}
                  />
                </li>
              </ul>
            </Panel>
          </Collapse>
        </div>
        <div className={styles.filterList}>
          <Collapse
            collapsible="header"
            defaultActiveKey={[InputControlsNames.SHOW_VAULTS_STATUS]}
            className={styles.collapse}
          >
            <Panel
              header="Status"
              key={InputControlsNames.SHOW_VAULTS_STATUS}
              className={styles.collapseHeader}
            >
              <RadioAntd.Group
                className={styles.sidebarList}
                onChange={changeRadio}
                value={currentRadio}
              >
                <div className={styles.sidebarList}>
                  <Controller
                    control={control}
                    name={InputControlsNames.SHOW_VAULTS_STATUS}
                    render={({ field: { onChange, value, ref, ...field } }) => (
                      <RadioAntd.Group
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                      >
                        {STATUS_VALUES.map(({ name, value }) => (
                          <div className={styles.sidebarListItem} key={value}>
                            <Radio value={value} label={name} {...field} />
                          </div>
                        ))}
                      </RadioAntd.Group>
                    )}
                  />
                </div>
              </RadioAntd.Group>
            </Panel>
          </Collapse>
        </div>
      </div>
    </>
  );
};

const STATUS_VALUES = [
  {
    name: 'All',
    value: StatusRadioNames.SHOW_ALL_VAULTS,
  },
  {
    name: 'Active',
    value: StatusRadioNames.SHOW_ACTIVE_VAULTS,
  },
  {
    name: 'Auction live',
    value: StatusRadioNames.SHOW_AUCTION_LIVE_VAULTS,
  },
  {
    name: 'Auction finished',
    value: StatusRadioNames.SHOW_AUCTION_FINISHED_VAULTS,
  },
  {
    name: 'Archived',
    value: StatusRadioNames.SHOW_ARCHIVED_VAULTS,
  },
];
