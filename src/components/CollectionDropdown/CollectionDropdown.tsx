import { FC, useState } from 'react';
import ReactSelect, { components, MultiValue } from 'react-select';
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
  const [values, setValues] = useState<MultiValue<Option>>([]);

  const colourStyles = {
    control: (styles, isFocused) => ({
      ...styles,
      backgroundColor: 'transparent',
      boxShadow: isFocused && 'none',
      border: 'transparent',
      cursor: 'pointer',
      flexWrap: 'nowrap',
      minHeight: 24,
      height: 24,
      justifyContent: 'flex-end',
    }),
    option: (base, state) => {
      return {
        ...base,
        backgroundColor: 'transparent',
        padding: '7.5px 20px',
        cursor: 'pointer',
        opacity: state.isSelected ? 1 : 0.3,
        '&:hover': { opacity: 1, backgroundColor: 'var(--color-gray-7)' },
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: 'var(--black-color)',
        border: '1px solid var(--gray-color-3)',
        borderRadius: 0,
        zIndex: 5,
      };
    },
    placeholder: (styles) => {
      return {
        ...styles,
        width: 182,
        color: 'var(--white-color)',
        '@media (max-width: 780px)': {
          width: '100%',
          fontSize: 15,
        },
      };
    },
    indicatorSeparator: () => ({ display: 'none' }),
    clearIndicator: () => ({ display: 'none' }),
    dropdownIndicator: () => ({
      color: 'hsl(0, 0%, 80%)',
      padding: 8,
      marginLeft: '-10px',
      marginTop: 5,
      '&:hover': { color: 'hsl(0, 0%, 20%)' },
    }),
    menuList: () => ({ padding: '6px 0' }),
  };

  const Option = (props) => {
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
      styles={colourStyles}
      value={values}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      maxMenuHeight={500}
      isMulti
    />
  );
};
