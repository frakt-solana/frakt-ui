import React from 'react';
import styles from './styles.module.scss';
import { Modal as ModalAnt, ModalProps as ModalAntProps } from 'antd';
import { CloseIcon } from '../../icons';

export interface ModalProps extends ModalAntProps {
  className?: string;
  children?: any;
}

export const Modal = ({
  children,
  footer = null,
  ...props
}: ModalProps): JSX.Element => {
  return (
    <ModalAnt
      {...props}
      footer={footer}
      className={styles.modal}
      closeIcon={
        <CloseIcon width="24px" height="24px" className={styles.close} />
      }
    >
      {children}
    </ModalAnt>
  );
};
