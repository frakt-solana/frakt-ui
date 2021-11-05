import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface NFTCheckboxInterface {
  className?: string;
  selected?: boolean;
  imageUrl?: string;
  name: string;
  onClick?: () => void;
}

const NFTCheckbox = ({
  className,
  selected = false,
  imageUrl,
  name,
  onClick,
}: NFTCheckboxInterface): JSX.Element => {
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
