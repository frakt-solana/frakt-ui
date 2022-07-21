import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import styles from './BorrowBanner.module.scss';

const BorrowBanner: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2 className={styles.title}>Borrow money</h2>
        <p className={styles.subtitle}>Select NFT to use as a collateral</p>
      </div>
      <NavLink to={PATHS.BORROW}>
        <Button
          className={styles.btn}
          type="alternative"
          onClick={() => sendAmplitudeData('loans-borrow')}
        >
          Borrow
        </Button>
      </NavLink>
    </div>
  );
};

export default BorrowBanner;
