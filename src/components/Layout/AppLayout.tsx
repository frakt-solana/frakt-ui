import { FC, useEffect } from 'react';
import classNames from 'classnames';

import Header from '../Header';
import NotificationBar from '../NotificationBar';
import styles from './styles.module.scss';
import { useWalletModal } from '../../contexts/WalletModal';
import { useHealthModal } from '../../contexts/HealthModal';
import { HeaderStateProvider, useHeaderState } from './headerState';

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const Layout: FC<LayoutProps> = ({
  customHeader,
  children,
  className = '',
  contentClassName = '',
}) => {
  const { visible, setVisible } = useWalletModal();
  const health = useHealthModal();
  const { isHeaderHidden, onContentScroll } = useHeaderState();

  useEffect(() => {
    visible && setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={classNames(styles.layout, className)}>
      <Header
        className={classNames(styles.header, {
          [styles.headerHide]: isHeaderHidden,
        })}
        customHeader={customHeader}
      />
      <div
        // onScroll={onContentScroll}
        // id="app-content"
        className={classNames(styles.content, contentClassName)}
      >
        {children}
      </div>
      <NotificationBar
        mode={health?.config?.mode}
        className={classNames(styles.notificationBar, {
          [styles.notificationBarHide]: !health.visible,
        })}
        handleClose={() => {
          health.setVisible(false);
        }}
      >
        {health?.config?.content}
      </NotificationBar>
      <div className={styles.noise} />
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
