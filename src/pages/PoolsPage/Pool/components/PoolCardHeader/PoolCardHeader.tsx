import { FC } from 'react';
import styles from './styles.module.scss';

export const PoolCardHeader: FC<{ isAwarded: boolean }> = ({ isAwarded }) => {
  return (
    <div className={styles.header}>
      {isAwarded && <div className={styles.awarder}>Awarded</div>}
    </div>
  );
};
