import { FC } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface CustomCheckboxInterface {
  className?: string;
}

const CustomCheckbox: FC<CustomCheckboxInterface> = ({ className }) => {
  return <Checkbox className={classNames(styles.customCheckbox, className)} />;
};

export default CustomCheckbox;
