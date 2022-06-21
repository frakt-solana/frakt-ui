import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Modal as ModalAnt } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { CloseIcon } from '../../icons';
import DiscordIcon from '../../icons/DiscordIcon2';
import { LinkWithArrow } from '../LinkWithArrow';
import { commonActions } from '../../state/common/actions';
import { selectUser, selectModalVisible } from '../../state/common/selectors';

import styles from './DiscordModal.module.scss';

export const DiscordModal: FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectModalVisible);
  const user = useSelector(selectUser);

  const onClose = () => {
    dispatch(
      commonActions.fetchUserFulfilled({
        ...user,
        isOnServer: true,
      }),
    );
    dispatch(commonActions.toggleDiscordModal());
  };

  useEffect(() => {
    if (user && !user.isOnServer) {
      dispatch(commonActions.toggleDiscordModal());
    }
  }, [dispatch, user]);

  return (
    <ModalAnt
      visible={visible}
      footer={null}
      className={classNames(styles.modal)}
      wrapClassName={styles.wrap}
      closeIcon={
        <CloseIcon width="24px" height="24px" className={styles.close} />
      }
      onCancel={onClose}
    >
      <div className={styles.content}>
        <span className={styles.infoTitle}>
          <DiscordIcon className={styles.logo} /> One more step...
        </span>
        <span className={styles.infoSubtitle}>
          You have subscribed to our updates, but you’re not a member of our
          discord server :(
        </span>
        <LinkWithArrow
          to="https://tinyurl.com/zp3rx6z3"
          label="Join server"
          className={styles.link}
        />
      </div>
    </ModalAnt>
  );
};
