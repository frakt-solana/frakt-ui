import { FC } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface CustomCheckboxInterface {
  className?: string;
  checked?: boolean;
  onChange?: (value: any) => void;
  value?: boolean;
}

const CustomCheckbox: FC<CustomCheckboxInterface> = ({
  className,
  onChange = () => {},
  value,
}) => {
  return (
    <Checkbox
      onClick={() => onChange(!value)}
      checked={value}
      className={classNames(styles.customCheckbox, className)}
    />
  );
};

export default CustomCheckbox;
