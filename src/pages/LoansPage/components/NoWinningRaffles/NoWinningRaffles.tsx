import { FC } from 'react';

import styles from './NoWinningRaffles.module.scss';
import Button from '../../../../components/Button';

const NoWinningRaffles: FC<{ onClick }> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        You didn{`'`}t win the lottery (yet!) :{`)`} Want to give it a try?
      </h2>
      <Button type="alternative" className={styles.btn} onClick={onClick}>
        I{`'`}m feeling lucky
      </Button>
    </div>
  );
};

export default NoWinningRaffles;
