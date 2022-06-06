import classNames from 'classnames';
import { FocusEventHandler } from 'react';

import ReactSelect, { components } from 'react-select';
import styles from './CollectionDropdown.module.scss';

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

const CollectionDropdown = ({
  className = '',
  valueContainerClassName = '',
  label,
  onFocus,
  disabled,
  ...props
}: SelectProps) => {
  const Option = (props: any) => {
    return (
      <span
        className={classNames(styles.valueContainer, valueContainerClassName)}
      >
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />

          {label && <span className={styles.label}>{label}</span>}
          <span className={styles.value}>{props.label}</span>
          <div className={styles.input}>{props.children[1]}</div>
        </components.Option>
      </span>
    );
  };

  return (
    <ReactSelect
      {...props}
      isSearchable={false}
      components={{ Option }}
      maxMenuHeight={500}
      className={classNames(styles.select, className)}
      onFocus={onFocus}
      isDisabled={disabled}
      classNamePrefix="custom-select"
    />
  );
};

export default CollectionDropdown;
