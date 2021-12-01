import React from 'react';
import styles from './styles.module.scss';
import {
  Modal as ModalAnt,
  ModalFuncProps,
  ModalProps as ModalAntProps,
} from 'antd';
import { CloseIcon } from '../../icons';
import classNames from 'classnames';

export interface ModalProps extends ModalAntProps {
  className?: string;
  children?: any;
}

export interface ModalConfirmProps extends ModalFuncProps {
  className?: string;
}

export const ConfirmModal = (props: ModalConfirmProps) =>
  ModalAnt.confirm({
    className: classNames(styles.modal, props.className),
    closeIcon: (
      <CloseIcon width="24px" height="24px" className={styles.close} />
    ),
    ...props,
  });

export const Modal = ({
  children,
  footer = null,
  className,
  ...props
}: ModalProps): JSX.Element => {
  return (
    <ModalAnt
      {...props}
      footer={footer}
      className={classNames(styles.modal, className)}
      wrapClassName={styles.wrap}
      closeIcon={
        <CloseIcon width="24px" height="24px" className={styles.close} />
      }
    >
      {children}
    </ModalAnt>
  );
};
