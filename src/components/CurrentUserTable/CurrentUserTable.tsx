import React from 'react';

import styles from './styles.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { frktBNToString } from '../../utils';
import { useNativeAccount } from '../../hooks/useNativeAccount';
import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { FRKTIcon, SolanaIcon } from '../../icons';
import { useFrktBalance } from '../../contexts/userTokens';

interface CurrentUserTableProps {
  className?: string;
}

const CurrentUserTable = ({
  className = '',
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { balance } = useFrktBalance();
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

  const getFrktBalanceValue = () => {
    const frktBalance = balance ? frktBNToString(balance, 2) : '0';
    const valueStr = `${frktBalance !== '0' ? frktBalance : '--'} `;
    return (
      <div className={styles.row}>
        <span>Tokens</span> {valueStr} {<FRKTIcon />} FRKT
      </div>
    );
  };

  return (
    <div className={`${className} ${styles.wrapper}`}>
      {getAddress()}
      {getBalanceValue()}
      {getFrktBalanceValue()}
      <button onClick={disconnect} className={styles.disconnectButton}>
        Disconnect wallet
      </button>
    </div>
  );
};

export default CurrentUserTable;
