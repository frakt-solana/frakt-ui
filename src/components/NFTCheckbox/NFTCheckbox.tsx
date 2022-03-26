import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';

interface NFTCheckboxInterface {
  className?: string;
  selected?: boolean;
  imageUrl?: string;
  name: string;
  onClick?: () => void;
  ltvPrice?: number;
}

const NFTCheckbox: FC<NFTCheckboxInterface> = ({
  className,
  selected = false,
  imageUrl,
  name,
  onClick,
  ltvPrice,
}) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames([
          styles.root,
          { [styles.root_checked]: selected },
          className,
        ])}
        onClick={onClick}
      >
        <div
          className={styles.root__image}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className={styles.root__content}>
          <p className={styles.root__title}>{name}</p>
          {ltvPrice && (
            <div className={styles.ltvWrapper}>
              <p className={styles.ltvTitle}>LTV</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{ltvPrice.toFixed(2)}</p>
                <div className={styles.tokenInfo}>
                  <img className={styles.ltvImage} src={SOL_TOKEN.logoURI} />
                  <p className={styles.ltvText}>{SOL_TOKEN.symbol}</p>
                </div>
              </div>
            </div>
          )}
          <div className={styles.root__checkboxWrapper}>
            <span className={styles.root__checkbox}>
              {selected ? 'Selected' : 'Select'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NFTCheckbox);
