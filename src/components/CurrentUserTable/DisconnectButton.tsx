import React from 'react';
import ButtonArrow from '../ButtonArrow';

import styles from './styles.module.scss';

interface DisconnectButtonInterface {
  onClick: () => void;
}

export const DisconnectButton = ({
  onClick,
}: DisconnectButtonInterface): JSX.Element => (
  <ButtonArrow className={styles.disconnectButton} onClick={onClick} arrowLeft>
    Disconnect wallet
  </ButtonArrow>
);
