import { FC } from 'react';

import styles from './NoWinningRaffles.module.scss';
import Button from '../../../../components/Button';

const NoWinningRaffles: FC<{ onClick }> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        You didn{`'`}t win the lottery :{`)`} But you can try this
      </h2>
      <Button type="alternative" className={styles.btn} onClick={onClick}>
        Try the lottery
      </Button>
    </div>
  );
};

export default NoWinningRaffles;
