import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useConnection } from '@solana/wallet-adapter-react';

import { getOwnerAvatar, useNameServiceInfo } from '../../../utils/nameService';
import { shortenAddress } from '../../../utils/solanaUtils';
import { ArrowRightTop, PencilIcon, TwitterIcon2 } from '../../../icons';
import Button from '../../../components/Button';
import styles from './ProfileCard.module.scss';

export const ProfileCard: FC = () => {
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { connection } = useConnection();

  useEffect(() => {
    walletPubkey && getNameServiceInfo(walletPubkey, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPubkey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <h2 className={styles.title}>User info</h2>
        <h3 className={styles.description}>
          <div
            className={styles.ownerAvatar}
            style={{
              backgroundImage: `url(${getOwnerAvatar(
                nameServiceInfo.twitterHandle,
              )})`,
            }}
          >
            <div className={styles.editAvatarIcon}>
              <PencilIcon />
            </div>
          </div>

          <div className={styles.ownerInfo}>
            <p>UserName4123</p>
            <p className={styles.ownerAddress}>
              {nameServiceInfo?.domain
                ? `${nameServiceInfo?.domain} (${shortenAddress(walletPubkey)})`
                : `${shortenAddress(walletPubkey)}`}
            </p>
            <p className={styles.leadearboard}>
              #56 in Leadearboard
              <ArrowRightTop className={styles.icon} />
            </p>
          </div>

          {nameServiceInfo?.twitterHandle && (
            <a
              className={styles.ownerTwitter}
              href={`https://twitter.com/${nameServiceInfo.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon2 width={24} className={styles.twitterIcon} />
            </a>
          )}
        </h3>
      </div>

      <div className={styles.line} />

      <div className={styles.rewardInfo}>
        <h2 className={styles.title}>Rewards</h2>
        <div className={styles.scrollContent}>
          {rewardInfoMock.map(({ amount, symbol }) => (
            <div className={styles.rewardWrapper} key={amount}>
              <span>
                {amount} {symbol}
              </span>
              <Button className={styles.btn} type="alternative">
                Claim rewards
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const rewardInfoMock = [
  {
    amount: '3454.545',
    symbol: 'FRKX',
  },
  {
    amount: '1428.182',
    symbol: 'FRKX',
  },
];
