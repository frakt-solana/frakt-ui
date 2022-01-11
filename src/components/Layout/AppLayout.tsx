import Header from '../Header';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { useState } from 'react';

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
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [prevOffsetTop, setPrevOffsetTop] = useState(0);

  const onContentScroll = (event) => {
    const contentOffsetTop = event.target.scrollTop;
    setPrevOffsetTop(contentOffsetTop);

    if (contentOffsetTop > 200 && contentOffsetTop > prevOffsetTop) {
      setIsHeaderHidden(true);
    } else {
      setIsHeaderHidden(false);
    }
  };

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
        {children}
      </div>
    </div>
  );
};
