import { Checkbox, Radio } from 'antd';
import classNames from 'classnames/bind';
import { Control, Controller } from 'react-hook-form';
import styles from './styles.module.scss';
import React from 'react';

interface IToggleProps {
  className?: string;
  disabled?: boolean;
  value?: number;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

interface IControlledToggleProps extends IToggleProps {
  control: Control<any>;
  name: string;
}

const CustomRadio = ({
  className = '',
  disabled = false,
  value,
  label = null,
}: IToggleProps): JSX.Element => (
  <Radio
    className={classNames(styles.radio, className)}
    disabled={disabled}
    value={value}
  >
    {label}
  </Radio>
);

export const ControlledRadio = ({
  control,
  name,
  ...props
}: IControlledToggleProps): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ field: { ref, ...field } }) => {
      return <CustomRadio {...props} {...field} />;
    }}
  />
);

export default Checkbox;
