import { FC } from 'react';
import classNames from 'classnames';

import styles from './LoanCard.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

interface NFTCheckboxInterface {
  className?: string;
  selected?: boolean;
  imageUrl?: string;
  name: string;
  ltvPrice?: string;
}

const LoanCard: FC<NFTCheckboxInterface> = ({
  className,
  imageUrl,
  name,
  ltvPrice,
}) => {
  const timeLeft = {
    days: '2',
    hours: '23',
    minutes: '23',
    seconds: '13',
  };

  const timePercent = '40';

  return (
    <div className={styles.wrapper}>
      <div className={classNames([styles.root, className])}>
        <div
          className={styles.root__image}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className={styles.root__content}>
          <p className={styles.root__title}>{name}</p>
          <div className={styles.ltvWrapper}>
            <p className={styles.ltvTitle}>LTV</p>
            <div className={styles.ltvContent}>
              <p className={styles.ltvText}>{ltvPrice}</p>
              <div className={styles.tokenInfo}>
                <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
              </div>
            </div>
            <p className={styles.ltvTitle}>RETURMENT</p>
            <div className={styles.countdown}>
              <p className={styles.timeItem}>{timeLeft.days}d</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{timeLeft.hours}h</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{timeLeft.minutes}m</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{timeLeft.seconds}s</p>
            </div>
            <div className={styles.timeProgressWrapper}>
              <div
                className={styles.timeProgress}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
          <Button type="alternative" className={styles.btn}>
            Return
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
