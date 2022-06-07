import { FC, useState } from 'react';
import ReactSelect, { components } from 'react-select';
import classNames from 'classnames';

import styles from './CollectionDropdown.module.scss';
import { Checkbox } from '../Checkbox';

interface Option {
  label: JSX.Element | string;
  value: unknown;
}

interface CollectionDropdownProps {
  options: Option[];
  className?: string;
  wrapperClassName?: string;
}

export const CollectionDropdown: FC<CollectionDropdownProps> = ({
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const [values, setValues] = useState<any>([]);

  const Option = (props: any) => {
    return (
      <span className={classNames(styles.wrapper, wrapperClassName)}>
        <components.Option {...props}>
          <Checkbox
            className={styles.checkbox}
            onChange={() => null}
            value={props.isSelected}
            label={props.label}
          />
        </components.Option>
      </span>
    );
  };

  return (
    <ReactSelect
      {...props}
      components={{ Option }}
      onChange={(newValues) => setValues(newValues)}
      placeholder={`Selected collections ${values?.length || ''}`}
      className={classNames(styles.select, className)}
      classNamePrefix="custom-select"
      value={values}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      maxMenuHeight={500}
      isMulti
    />
  );
};
