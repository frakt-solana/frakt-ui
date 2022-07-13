import { FC } from 'react';
import { Checkbox as CheckboxAntd } from 'antd';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface CheckboxProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  label?: JSX.Element;
  onChange?: (value: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}) => (
  <CheckboxAntd
    className={classNames(styles.checkbox, className)}
    disabled={disabled}
    checked={value}
    onClick={() => onChange(!value)}
  >
    <p className={classNames(styles.label, { [styles.checkedLabel]: value })}>
      {label?.props?.children}
    </p>
  </CheckboxAntd>
);
