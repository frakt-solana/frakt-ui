import React, { FC } from 'react';
import styles from './styles.module.scss';
import { QuestionIcon } from '../../../../icons';
import { BuyRandomNft } from './BuyRandomNft';
import { MarketNavigation } from '../../../../components/MarketNavigation';
import { useHeaderState } from '../../../../contexts/HeaderState';
import classNames from 'classnames';

const tempBgImage =
  'https://aacsdzhn52gnk67swxcahjyrwtcpaykzbsletupsuur7dupnqzsa.arweave.net/AAUh5O3ujNV78rXEA6cRtMTwYVkMlknR8qUj8dHthmQ';

export const HeaderBuy: FC = () => {
  const { headerVisible } = useHeaderState();
  return (
    <div
      className={classNames({
        [styles.positionWrapper]: true,
        [styles.headerHidden]: !headerVisible,
      })}
    >
      <div className={`container ${styles.container}`}>
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
            <BuyRandomNft />
            <MarketNavigation className={styles.marketNavigation} />
          </div>
        </div>
      </div>
    </div>
  );
};
