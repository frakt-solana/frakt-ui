import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';

const Page404 = (): JSX.Element => {
  return (
    <AppLayout>
      <div className={styles.wrapper}>
        <span className={styles.text404}>404</span>
        <span className={styles.reason}>Page not found</span>
      </div>
    </AppLayout>
  );
};

export default Page404;
