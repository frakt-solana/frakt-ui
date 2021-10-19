import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import DoneIcon from '../../icons/DoneIcon';
import Badge from '../Badge';

const Card = (): JSX.Element => (
  <div className={styles['card-container']}>
    <div className={styles.card}>
      <div className={styles.image}>
        <div className={styles['action-container']}>
          <DoneIcon className={classNames(styles.action, styles.icon)} />
          <Badge className={styles.action} label="COLLECTION" />
          <Badge className={styles.action} label="LIVE ACTION" />
        </div>
      </div>
      <div className={styles['title-container']}>
        <div className={styles.title}>BAYC History -The Great Floor Sweep</div>
        <div className={styles.subtitle}>
          <div className={styles.color} />
          <span>DINGALING.ETH</span>
        </div>
      </div>
      <div className={styles['stat-container']}>
        <div className={styles.stat}>
          <div className={styles.item}>
            <div className={styles.title}>FRACTIONS AMOUNT</div>
            <div className={styles.subtitle}>100M</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>BOUGHT FRACTIONS</div>
            <div className={styles.subtitle}>4.90%</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>VALUATION</div>
            <div className={styles.subtitle}>718K</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Card;
