import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface ContainerProps {
  component?: string;
  className?: string;
  children: JSX.Element[] | JSX.Element;
}

export const Container = ({
  component = 'div',
  className = '',
  children,
}: ContainerProps): JSX.Element => {
  return React.createElement(
    component,
    { className: classNames([styles.container, className]) },
    children,
  );
};
