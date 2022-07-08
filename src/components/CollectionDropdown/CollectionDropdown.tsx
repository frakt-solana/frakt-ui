import { FC } from 'react';
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
  setValues?: (value) => void;
  values?: any;
}

export const CollectionDropdown: FC<CollectionDropdownProps> = ({
  className = '',
  wrapperClassName = '',
  setValues,
  values,
  ...props
}) => {
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
    valueContainer: (styles) => {
      return {
        ...styles,
        padding: 0,
      };
    },
    input: (styles) => {
      return {
        ...styles,
        margin: 0,
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: 'var(--black-color)',
        border: '1px solid var(--gray-color-3)',
        borderRadius: 0,
        overlay: 'auto',
        zIndex: 5,
      };
    },
    placeholder: (styles) => {
      return {
        ...styles,
        margin: 0,
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
      marginTop: 5,
      '&:hover': {
        color: 'hsl(0, 0%, 40%)',
        transition: 'var(--transition-1)',
      },
    }),
    menuList: (styles) => {
      return {
        ...styles,
        padding: '6px 0',
        '&::-webkit-scrollbar': {
          width: 5,
        },

        '&::-webkit-scrollbar-track': {
          background: 'var(--color-gray-4)',
        },
      };
    },
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
      maxMenuHeight={200}
      isMulti
    />
  );
};
