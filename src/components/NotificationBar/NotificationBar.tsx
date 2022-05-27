import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { selectNotification } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import { initialNotificationState } from '../../state/common/reducers';
import { CloseIcon } from '../../icons';
import styles from './styles.module.scss';

export const NotificationBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(commonActions.setNotification({ isVisible: false }));
  };
  const notification: typeof initialNotificationState =
    useSelector(selectNotification);

  return (
    <div
      className={classNames(styles.notificationBar, {
        [styles[notification?.config?.mode]]: notification?.config?.mode,
        [styles.notificationBarHide]: !notification.isVisible,
      })}
    >
      {notification?.config?.content}
      <div className={styles.close} onClick={handleClose}>
        <CloseIcon width="12px" height="12px" className={styles.icon} />
      </div>
    </div>
  );
};
