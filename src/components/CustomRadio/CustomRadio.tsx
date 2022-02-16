import { Radio } from 'antd';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import React from 'react';

interface IToggleProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

export const ControlledRadio = ({
  className = '',
  disabled = false,
  checked = false,
  label = null,
  value,
}: IToggleProps): JSX.Element => (
  <Radio
    className={classNames(styles.radio, className)}
    disabled={disabled}
    checked={checked}
    value={value}
  >
    {label}
  </Radio>
);
