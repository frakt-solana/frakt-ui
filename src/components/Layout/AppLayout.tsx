import { FC, useEffect } from 'react';
import classNames from 'classnames';

import Header from '../Header';
import styles from './styles.module.scss';
import WalletContent from '../WalletContent';
import { useWalletModal } from '../../contexts/WalletModal';
import { HeaderStateProvider, useHeaderState } from './headerState';

interface LayoutProps {
  CustomHeader?: FC;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const Layout: FC<LayoutProps> = ({
  CustomHeader,
  children,
  className = '',
  contentClassName = '',
}) => {
  const { visible, setVisible } = useWalletModal();
  const { isHeaderHidden, onContentScroll } = useHeaderState();

  useEffect(() => {
    visible && setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={className}>
      <Header
        className={classNames(styles.header, {
          [styles.headerHide]: isHeaderHidden,
        })}
        CustomHeader={CustomHeader}
      />
      <div
        onScroll={onContentScroll}
        id="app-content"
        className={classNames(styles.content, contentClassName)}
      >
        {children}
      </div>
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
