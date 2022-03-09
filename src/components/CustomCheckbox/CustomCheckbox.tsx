import { FC } from 'react';
import { Checkbox as CheckboxAnt } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface CheckboxInterface {
  className?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  value?: boolean;
}

const Checkbox: FC<CheckboxInterface> = ({
  className,
  onChange = () => {},
  value,
}) => {
  return (
    <CheckboxAnt
      onClick={() => onChange(!value)}
      checked={value}
      className={classNames(styles.checkbox, className)}
    />
  );
};

export default Checkbox;

Checkbox.displayName = 'Checkbox';
