import { FC, ReactElement } from 'react';
import { Dropdown as AntdDropdown } from 'antd';
import { ArrowDownBtn } from '../../icons';
import styles from './styles.module.scss';

interface DropdownProps {
  title: string;
  dropdownMenu: ReactElement;
  className?: string;
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
  dropdownMenu,
  placement = 'bottomRight',
  className,
}) => {
  return (
    <li id="menu-dropdown" className={styles.navigationItem}>
      <div className={styles.mobileDropdown}>{dropdownMenu}</div>
      <AntdDropdown
        overlay={dropdownMenu}
        placement={placement}
        getPopupContainer={() => document.getElementById('menu-dropdown')}
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
