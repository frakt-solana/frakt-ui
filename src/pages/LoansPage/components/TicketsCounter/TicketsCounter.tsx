import { FC } from 'react';

import styles from './TicketsCounter.module.scss';
import { Ticket } from '../../../../icons';

interface TicketsCounterProps {
  tickets: string;
}

const TicketsCounter: FC<TicketsCounterProps> = ({ tickets }) => {
  return (
    <div className={styles.ticket}>
      <Ticket />
      Your tickets: {tickets}
    </div>
  );
};

export default TicketsCounter;
