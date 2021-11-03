import Header from '../Header';
import styles from './styles.module.scss';

interface AppLayoutProps {
  children: JSX.Element[] | JSX.Element;
  className?: string;
}

export const AppLayout = ({
  children,
  className = '',
}: AppLayoutProps): JSX.Element => {
  return (
    <div className={className}>
      <Header className={styles.header} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
