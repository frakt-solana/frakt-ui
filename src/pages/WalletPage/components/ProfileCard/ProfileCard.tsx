import { FC } from 'react';

import { getOwnerAvatar } from '../../../../utils/nameService';
import { shortenAddress } from '../../../../utils/solanaUtils';
import { /* PencilIcon, */ TwitterIcon2 } from '../../../../icons';
// import Button from '../../../../components/Button';
import styles from './ProfileCard.module.scss';
// import { LinkWithArrow } from '../../../../components/LinkWithArrow';

interface ProfileCard {
  name?: string;
  twitterName?: string;
  walletPubkey: string;
}

export const ProfileCard: FC<ProfileCard> = ({
  name,
  walletPubkey,
  twitterName,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <h2 className={styles.title}>User info</h2>
        <h3 className={styles.description}>
          <div
            className={styles.ownerAvatar}
            style={{
              backgroundImage: `url(${getOwnerAvatar(twitterName)})`,
            }}
          >
            {/* <div className={styles.editAvatarIcon}>
              <PencilIcon />
            </div> */}
          </div>

          <div className={styles.ownerInfo}>
            {!!name && <p>{name}</p>}
            <p className={styles.ownerAddress}>
              {shortenAddress(walletPubkey)}
            </p>
          </div>

          {twitterName && (
            <a
              className={styles.ownerTwitter}
              href={`https://twitter.com/${twitterName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon2 width={24} className={styles.twitterIcon} />
            </a>
          )}
        </h3>
      </div>

      {/* <div className={styles.line} /> */}

      {/* <div className={styles.rewardInfo}>
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
      </div> */}
    </div>
  );
};

// const rewardInfoMock = [
//   {
//     amount: '3454.545',
//     symbol: 'FRKX',
//   },
//   {
//     amount: '1428.182',
//     symbol: 'FRKX',
//   },
// ];
