import React from 'react';

import styles from './styles.module.scss';

interface WalletItemProps {
  onClick: () => void;
  imageSrc: string;
  imageAlt: string;
  name: string;
}

export const WalletItem = ({
  onClick,
  imageSrc,
  imageAlt,
  name,
}: WalletItemProps): JSX.Element => {
  return (
    <div className={styles.walletItemContainer}>
      <div className={styles.walletItem} onClick={onClick}>
        <img alt={imageAlt} src={imageSrc} />
        {name}
      </div>
    </div>
  );
};
