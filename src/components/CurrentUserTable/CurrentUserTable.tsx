import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { ArrowRightTop, SolanaIcon, UserIcon } from '../../icons';
import { useNativeAccount } from '../../utils/accounts';
import styles from './styles.module.scss';
import NavigationLink from '../Header/NavigationLink';
import { PATHS } from '../../constants';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface CurrentUserTableProps {
  className?: string;
}

const CurrentUserTable = ({
  className = '',
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { account } = useNativeAccount();

  if (!publicKey) {
    return null;
  }

  const getAddress = () => {
    const valueStr = shortenAddress(`${publicKey || ''}`);
    return (
      <div className={styles.row}>
        <span>Address</span> {valueStr}
      </div>
    );
  };

  const getBalanceValue = () => {
    const valueStr = `${formatNumber.format(
      (account?.lamports || 0) / LAMPORTS_PER_SOL,
    )}`;
    return (
      <div className={styles.row}>
        <span>Balance</span> {valueStr} <SolanaIcon /> SOL
      </div>
    );
  };

  return (
    <div className={`${className} ${styles.wrapper}`}>
      <div className={styles.userWrapper}>
        <UserIcon />
        <div className={styles.userInfo}>
          <p className={styles.userKey}>
            {shortenAddress(`${publicKey || ''}`)}
          </p>
          <NavLink
            className={`link-with-arrow ${styles.myCollectionLink}`}
            to={`${PATHS.WALLET}/${publicKey.toString()}`}
          >
            <span>
              My collection
              <ArrowRightTop />
            </span>
          </NavLink>
        </div>
      </div>
      {getAddress()}
      {getBalanceValue()}
      <button onClick={disconnect} className={styles.disconnectButton}>
        Disconnect wallet
      </button>
    </div>
  );
};

export default CurrentUserTable;
