import { Checkbox, Switch } from 'antd';
import classNames from 'classnames/bind';
import { Control, Controller } from 'react-hook-form';
import styles from './styles.module.scss';
import React from 'react';

interface IToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

interface IControlledToggleProps extends IToggleProps {
  control: Control<any>;
  name: string;
}

const CustomCheckbox = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}: IToggleProps): JSX.Element => (
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
}: IControlledToggleProps): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ field: { ref, ...field } }) => {
      return <CustomCheckbox {...props} {...field} />;
    }}
  />
);

export default Checkbox;
