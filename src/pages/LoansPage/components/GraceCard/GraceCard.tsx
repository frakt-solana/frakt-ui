import { FC } from 'react';
import classNames from 'classnames';

import styles from './GraceCard.module.scss';
import moment from 'moment';
import { Timer } from '../../../../icons';
import { useCountdown } from '../../../../hooks';

const GraceCard: FC<{ data }> = ({ data }) => {
  const { timeLeft } = useCountdown(moment(data.expiredAt).unix());

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={data.nftImageUrl} />
        <p className={styles.nftName}>{data.nftName}</p>
      </div>
      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>floor price</p>
          <p className={styles.value}>{`${data.loanValue} SOL`}</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>{`${data.liquidationPrice} SOL`}</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>Grace period</p>
          <div className={styles.wrapper}>
            <Timer className={styles.icon} />
            <div>
              <div className={styles.countdown}>
                {timeLeft.days}d<p>:</p>
                {timeLeft.hours}h<p>:</p>
                {timeLeft.minutes}m
              </div>
              {/* <div className={styles.timeProgressWrapper}>
                <div
                  className={styles.timeProgress}
                  style={{ width: `${80}%` }}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraceCard;
