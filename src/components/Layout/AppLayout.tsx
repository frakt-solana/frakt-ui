import Header from '../Header';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import WalletContent from '../WalletContent';
import { useWalletModal } from '../../contexts/WalletModal';

interface AppLayoutProps {
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const AppLayout = ({
  children,
  className = '',
  contentClassName = '',
}: AppLayoutProps): JSX.Element => {
  const { visible, setVisible } = useWalletModal();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [prevOffsetTop, setPrevOffsetTop] = useState(0);

  const onContentScroll = (event) => {
    const offset = event.target.scrollTop;

    if (offset > scrollTop) setPrevOffsetTop(offset);
    if (offset < prevOffsetTop) setScrollTop(offset);

    if (offset > 200 && offset > prevOffsetTop) setIsHeaderHidden(true);
    if (offset + 100 < prevOffsetTop) setIsHeaderHidden(false);
  };

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
      />
      <div
        onScroll={onContentScroll}
        id="app-content"
        className={classNames(styles.content, contentClassName)}
      >
        {visible && <WalletContent />}
        {children}
      </div>
    </div>
  );
};
