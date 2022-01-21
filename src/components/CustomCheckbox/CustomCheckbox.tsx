import { FC } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface CustomCheckboxInterface {
  className?: string;
  checked?: boolean;
  onChange?: () => void;
}

const CustomCheckbox: FC<CustomCheckboxInterface> = ({
  className,
  onChange,
  checked,
}) => {
  return (
    <Checkbox
      onChange={onChange}
      checked={checked}
      className={classNames(styles.customCheckbox, className)}
    />
  );
};

export default CustomCheckbox;
