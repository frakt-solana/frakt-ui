import React, { LegacyRef } from 'react';
import styles from './styles.module.scss';
import { Input as InputAnt, InputProps as InputPropsAnt } from 'antd';
import classNames from 'classnames';

export const Input = React.forwardRef(
  ({ className, ...props }: InputPropsAnt, ref) => {
    return (
      <InputAnt
        className={classNames(styles.input, className)}
        ref={ref as LegacyRef<InputAnt>}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
