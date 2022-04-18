import { FC, ReactElement } from 'react';
import { Dropdown as AntdDropdown } from 'antd';

import { ArrowDownBtn } from '../../icons';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  title: string;
  className?: string;
  children?: ReactElement;
  placement?:
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight';
}

export const Dropdown: FC<DropdownProps> = ({
  title,
  placement = 'bottomRight',
  className,
  children,
}) => {
  return (
    <li id={`menu-dropdown-${title}`} className={styles.navigationItem}>
      <div className={styles.mobileDropdown}>{children}</div>
      <AntdDropdown
        overlay={children}
        placement={placement}
        getPopupContainer={() =>
          document.getElementById(`menu-dropdown-${title}`)
        }
        overlayClassName={styles.dropdown}
        className={className}
      >
        <div className={styles.dropdownTrigger}>
          {title} <ArrowDownBtn className={styles.moreArrowIcon} />
        </div>
      </AntdDropdown>
    </li>
  );
};
