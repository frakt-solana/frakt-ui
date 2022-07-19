import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { SolanaIcon, UserIcon } from '../../icons';
import { useNativeAccount } from '../../utils/accounts';
import { getDiscordUri, getDiscordAvatarUrl } from '../../utils';
import { PATHS } from '../../constants';
import { LinkWithArrow } from '../LinkWithArrow';
import { UserState } from '../../state/common/types';
import DiscordIcon from '../../icons/DiscordIcon2';
import styles from './styles.module.scss';

interface CurrentUserTableProps {
  className?: string;
  user?: UserState;
}

const CurrentUserTable = ({
  className = '',
  user = null,
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const avatarUrl = getDiscordAvatarUrl(user?.discordId, user?.avatar);

  if (!publicKey) {
    return null;
  }

  const getBalanceValue = () => {
    const valueStr = `${formatNumber.format(
      (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
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
        <UserIcon className={styles.avatar} url={avatarUrl} />
        <div className={styles.userInfo}>
          <p className={styles.userKey}>
            {shortenAddress(`${publicKey || ''}`)}
          </p>
          <LinkWithArrow
            to={`${PATHS.WALLET}/${publicKey.toString()}`}
            label="My profile"
            className={styles.myCollectionLink}
          />
        </div>
      </div>
      {getBalanceValue()}
      {!user && (
        <a
          href={getDiscordUri(publicKey)}
          className={styles.discordButton}
          rel="noopener noreferrer"
        >
          <DiscordIcon className={styles.logo} /> Link discord
        </a>
      )}
      <button onClick={disconnect} className={styles.disconnectButton}>
        Disconnect wallet
      </button>
    </div>
  );
};

export default CurrentUserTable;
