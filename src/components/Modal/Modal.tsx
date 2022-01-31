import { FC } from 'react';
import {
  Modal as ModalAnt,
  ModalFuncProps,
  ModalProps as ModalAntProps,
} from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { CloseIcon } from '../../icons';

export interface ModalProps extends ModalAntProps {
  className?: string;
  children?: any;
}

export interface ModalConfirmProps extends ModalFuncProps {
  className?: string;
}

export const SwapDifferentPriceContent: FC = () => {
  return (
    <>
      <p>
        Swap price is very different from the initial price per fraktion set for
        buyout.
      </p>
      <br />
      <p>
        It usually happens due to low liquidity in the pool, or the asset being
        overpriced/underpriced.
      </p>
      <br />
      <p>Do you wish to perform the swap anyway?</p>
    </>
  );
};

export const ConfirmModal = (
  props: ModalConfirmProps,
): { update: any; destroy: any } =>
  ModalAnt.confirm({
    className: classNames(styles.modal, props.className),
    closeIcon: (
      <CloseIcon width="24px" height="24px" className={styles.close} />
    ),
    okButtonProps: { className: styles.okButton },
    cancelButtonProps: { className: styles.cancelButton },
    content: props.content,
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
