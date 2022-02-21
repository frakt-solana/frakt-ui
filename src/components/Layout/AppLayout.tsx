import Header from '../Header';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import WalletContent from '../WalletContent';
import { useWalletModal } from '../../contexts/WalletModal';
import { useHeaderState } from '../../contexts/HeaderState';

interface AppLayoutProps {
  CustomHeader?: FC;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const AppLayout: FC<AppLayoutProps> = ({
  CustomHeader,
  children,
  className = '',
  contentClassName = '',
}) => {
  const { visible, setVisible } = useWalletModal();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [prevOffsetTop, setPrevOffsetTop] = useState(0);
  const { setHeaderVisible } = useHeaderState();

  const onContentScroll = (event) => {
    const offset = event.target.scrollTop;

    if (offset > scrollTop) setPrevOffsetTop(offset);
    if (offset < prevOffsetTop) setScrollTop(offset);

    if (offset > 200 && offset > prevOffsetTop) {
      setHeaderVisible(!isHeaderHidden);
      setIsHeaderHidden(true);
    }
    if (offset + 100 < prevOffsetTop) {
      setHeaderVisible(!isHeaderHidden);
      setIsHeaderHidden(false);
    }
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
