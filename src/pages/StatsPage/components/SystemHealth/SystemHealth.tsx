import { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Tooltip from '../../../../components/Tooltip';
import styles from './SystemHealth.module.scss';
import Block from '../Block';

interface SystemHealthProps {
  health?: number;
  primaryColor?: string;
  secondaryColor?: string;
  borderColor?: string;
  borderWidth?: number;
  cutout?: number;
}

const SystemHealth: FC<SystemHealthProps> = ({
  health,
  primaryColor = '#83D6A4',
  secondaryColor = '#3b5142',
  cutout = 70,
  borderWidth = 0,
  borderColor = 'tranparent',
}) => {
  const FULL_HEALTH = 100;
  const restHealth = FULL_HEALTH - health;

  const data = {
    datasets: [
      {
        data: [health, restHealth],
        backgroundColor: [primaryColor, secondaryColor],
        borderColor: borderColor,
        borderWidth: borderWidth,
        cutout: `${cutout}%`,
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Health</h2>
        <Tooltip placement="top" trigger="hover" overlay="text">
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      </div>
      <Block className={styles.block}>
        <Doughnut
          className={styles.chart}
          data={data}
          width={300}
          options={{ maintainAspectRatio: false }}
        />
        <div className={styles.innerText}>
          <p className={styles.subtitle}>System health</p>
          <p className={styles.value}>{health}%</p>
        </div>
      </Block>
    </div>
  );
};

export default SystemHealth;
