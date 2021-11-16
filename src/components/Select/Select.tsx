import React from 'react';
import ReactSelect from 'react-select';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { Control, Controller } from 'react-hook-form';

interface Options {
  label: any;
  value: any;
}

interface SelectProps {
  options: Options[];
  className?: string;
  valueContainerClassName?: string;
  onChange?: () => void;
  value?: Options;
  label?: string;
}

interface ControlledSelectProps extends SelectProps {
  control: Control<any>;
  name: string;
}

export const Select = ({
  className = '',
  valueContainerClassName = '',
  label,
  ...props
}: SelectProps): JSX.Element => {
  const ValueContainer = (valueContainerProps: any) => (
    <span
      className={classNames(styles.valueContainer, valueContainerClassName)}
    >
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.value}>
        {valueContainerProps.getValue()?.[0]?.label}
      </span>
      <div className={styles.input}>{valueContainerProps.children[1]}</div>
    </span>
  );

  return (
    <ReactSelect
      {...props}
      isSearchable={false}
      components={{ ValueContainer }}
      maxMenuHeight={500}
      className={classNames(styles.select, className)}
      classNamePrefix="custom-select"
    />
  );
};

export const ControlledSelect = ({
  control,
  name,
  ...props
}: ControlledSelectProps): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ field: { ref, ...field } }) => <Select {...props} {...field} />}
  />
);
