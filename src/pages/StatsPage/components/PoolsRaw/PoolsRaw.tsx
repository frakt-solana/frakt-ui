import { FC } from 'react';

import { ChartPie, defaultColors } from '../ChartPie';
import styles from './PoolsRaw.module.scss';
import okayBears from './mockImage/okayBears.png';
import degods from './mockImage/degods.png';

interface PoolsRawProps {
  data: any[];
  title: string;
}

const PoolsRaw: FC<PoolsRawProps> = ({ data, title }) => {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chart}>
        <ChartPie rawData={data} width={300} />
      </div>
      <div className={styles.header}>
        <p className={styles.subtitle}>Name</p>
        <p className={styles.subtitle}>TVL</p>
      </div>
      <div className={styles.table}>
        <div className={styles.body}>
          {data.map(({ name, value }, idx) => (
            <div key={idx} className={styles.row}>
              <div className={styles.rowInfo}>
                <div
                  className={styles.line}
                  style={{ background: defaultColors[idx] }}
                />
                {name === 'Other Collecions' ? (
                  <div className={styles.mockImages}>
                    <img src={okayBears} className={styles.rowIcon} />
                    <img src={degods} className={styles.rowIcon} />
                  </div>
                ) : (
                  <img
                    src="https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png"
                    className={styles.rowIcon}
                  />
                )}

                <p>{name}</p>
              </div>
              <p>{value} SOL</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoolsRaw;
