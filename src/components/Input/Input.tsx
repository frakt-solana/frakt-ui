import React from 'react';
import styles from './styles.module.scss';
import { Input as InputAnt, InputProps as InputPropsAnt } from 'antd';
import classNames from 'classnames';

export const Input = ({ className, ...props }: InputPropsAnt): JSX.Element => (
  <InputAnt className={classNames(styles.input, className)} {...props} />
);
