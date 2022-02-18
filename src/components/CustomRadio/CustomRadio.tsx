import { Radio } from 'antd';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import React from 'react';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  value: string;
  label?: string;
}

export const CustomRadio = ({
  className = '',
  disabled = false,
  checked = false,
  label = null,
  value,
}: ToggleProps): JSX.Element => (
  <Radio
    className={classNames(styles.radio, className)}
    disabled={disabled}
    checked={checked}
    value={value}
  >
    {label}
  </Radio>
);
