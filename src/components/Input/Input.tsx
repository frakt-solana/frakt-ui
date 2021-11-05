import React, { LegacyRef } from 'react';
import styles from './styles.module.scss';
import { Input as InputAnt, InputProps as InputPropsAnt } from 'antd';
import classNames from 'classnames';

interface InputProps extends InputPropsAnt {
  disableSymbols?: boolean;
  disableNumbers?: boolean;
  customRegexp?: string;
}

export const Input = React.forwardRef(
  (
    {
      className,
      disableSymbols = false,
      disableNumbers = false,
      customRegexp,
      ...props
    }: InputProps,
    ref,
  ) => {
    const onChange = (e) => {
      if (!props.onChange) return;
      let value = e.target.value;
      if (disableNumbers) value = value.replaceAll(/[0-9]/g, '');
      if (disableSymbols) value = value.replaceAll(/[^a-zA-Z0-9 ]/g, '');
      if (customRegexp) value = value.replaceAll(new RegExp(customRegexp), '');

      e.target.value = value;
      props.onChange(e);
    };

    return (
      <InputAnt
        className={classNames(styles.input, className)}
        ref={ref as LegacyRef<InputAnt>}
        {...props}
        onChange={onChange}
      />
    );
  },
);

Input.displayName = 'Input';
