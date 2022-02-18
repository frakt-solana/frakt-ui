import { Checkbox } from 'antd';
import classNames from 'classnames/bind';
import { Control, Controller } from 'react-hook-form';
import styles from './styles.module.scss';
import React from 'react';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
}

interface ControlledToggleProps extends ToggleProps {
  control: Control<any>;
  name: string;
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

export const ControlledCheckbox = ({
  control,
  name,
  ...props
}: ControlledToggleProps): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ field: { ref, ...field } }) => {
      return <CustomCheckbox {...props} {...field} />;
    }}
  />
);

export default Checkbox;
