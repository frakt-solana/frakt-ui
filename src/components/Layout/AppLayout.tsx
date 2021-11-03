import Header from '../Header';
import styles from './styles.module.scss';
import classNames from 'classnames';

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
  return (
    <div className={className}>
      <Header className={styles.header} />
      <div className={classNames(styles.content, contentClassName)}>
        {children}
      </div>
    </div>
  );
};
