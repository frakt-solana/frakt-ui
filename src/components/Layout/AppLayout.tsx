import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import Header from '../Header';
import NotificationBar from '../NotificationBar';
import styles from './styles.module.scss';
import { HeaderStateProvider, useHeaderState } from './headerState';
import { commonActions } from '../../state/common/actions';

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
  const dispatch = useDispatch();
  const { isHeaderHidden, onContentScroll } = useHeaderState();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
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
        onScroll={onContentScroll}
        id="app-content"
        className={classNames(styles.content, contentClassName)}
      >
        {children}
      </div>
      <NotificationBar />
      <div className={styles.noise} />
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
