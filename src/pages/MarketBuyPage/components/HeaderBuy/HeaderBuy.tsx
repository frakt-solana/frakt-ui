import React, { FC } from 'react';
import styles from './styles.module.scss';
import { QuestionIcon } from '../../../../icons';

const tempBgImage =
  'https://aacsdzhn52gnk67swxcahjyrwtcpaykzbsletupsuur7dupnqzsa.arweave.net/AAUh5O3ujNV78rXEA6cRtMTwYVkMlknR8qUj8dHthmQ';

export const HeaderBuy: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.randomWrapper}>
        <div className={styles.questionWrapper}>
          <img
            src={tempBgImage}
            alt="Pool image"
            className={styles.poolBgImage}
          />
          <QuestionIcon className={styles.questionIcon} />
        </div>
      </div>
    </div>
  );
};
