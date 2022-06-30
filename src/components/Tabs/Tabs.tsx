import { FC } from 'react';
import classNames from 'classnames';

import styles from './Tabs.module.scss';

export interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  value: string;
  setValue: (value: string) => void;
  className?: string;
  type?: 'primary' | 'secondary';
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  value,
  setValue,
  className,
  type = 'primary',
}) => {
  return (
    <div className={classNames(styles.tabsWrapper, className)}>
      {tabs.map(({ label, value: tabValue, disabled }) => (
        <button
          key={tabValue}
          className={classNames([
            styles.tab,
            styles[type],
            {
              [type === 'primary'
                ? styles.tabActive
                : styles.tabActiveSecondary]: tabValue === value,
            },
          ])}
          name={tabValue}
          onClick={() => setValue(tabValue)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
