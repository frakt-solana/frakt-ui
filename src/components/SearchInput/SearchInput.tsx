import React from 'react';
import styles from './styles.module.scss';
import { InputProps as InputPropsAnt } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from '../Input';
import classNames from 'classnames';

export const SearchInput = ({
  className,
  ...props
}: InputPropsAnt): JSX.Element => (
  <Input
    className={classNames(styles.input, className)}
    prefix={<SearchOutlined className={styles.search} />}
    {...props}
  />
);
