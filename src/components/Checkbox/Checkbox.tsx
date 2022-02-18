import { Checkbox } from 'antd';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import React from 'react';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
}

const CustomCheckbox = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}: ToggleProps): JSX.Element => (
  <Checkbox
    className={classNames(styles.checkbox, className)}
    disabled={disabled}
    checked={value}
    onClick={() => onChange(!value)}
  >
    {label}
  </Checkbox>
);

export default CustomCheckbox;
