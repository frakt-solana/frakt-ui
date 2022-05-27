import ReactSelect from 'react-select';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { FocusEventHandler } from 'react';

interface Option {
  label: JSX.Element | string;
  value: unknown;
}

interface SelectProps {
  options: Option[];
  className?: string;
  valueContainerClassName?: string;
  onChange?: () => void;
  value?: Option;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  label?: string;
  disabled?: boolean;
}

export const Select = ({
  className = '',
  valueContainerClassName = '',
  label,
  onFocus,
  disabled,
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
      onFocus={onFocus}
      isDisabled={disabled}
      classNamePrefix="custom-select"
    />
  );
};
