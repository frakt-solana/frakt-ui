import { FC } from 'react';
import { Radio } from '../../../../components/Radio';
import Block from '../Block';

import ChartPie from '../ChartPie';
import styles from './Pools.module.scss';

const Pools: FC = () => {
  const data = [
    { name: 'Solpunks', value: '132' },
    { name: 'Frakt', value: '100' },
    { name: 'Turtles', value: '132' },
    { name: 'Other Collecions', value: '400' },
  ];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Daily Active</h2>
      <Block className={styles.block}>
        <div className={styles.radioWrap}>
          <Radio className={styles.radio} label={'Daily stats'} value={''} />
          <Radio className={styles.radio} label={'Weekly stats'} value={''} />
        </div>
        <div className={styles.poolsConainer}>
          <PoolsRaw data={data} title={'NFT pools'} />
          <div className={styles.line} />
          <PoolsRaw data={data} title={'NFT loans'} />
        </div>
      </Block>
    </div>
  );
};

export default Pools;

interface PoolsRawProps {
  data: any[];
  title: string;
}

export const PoolsRaw: FC<PoolsRawProps> = ({ data, title }) => {
  return (
    <div>
      <h3 className={styles.subtitle}>{title}</h3>
      <div className={styles.chart}>
        <ChartPie rawData={data} />
      </div>
      <div>
        <div className={styles.listsInfo}>
          <p>Name</p>
          <p>TVL</p>
        </div>
        <div className={styles.poolsList}>
          {data.map(({ name, value }, idx) => (
            <div key={idx} className={styles.poolRow}>
              <div className={styles.poolInfo}>
                <div />
                <img
                  src="https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png"
                  className={styles.poolIcon}
                />
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
