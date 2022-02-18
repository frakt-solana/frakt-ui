import classNames from 'classnames/bind';
import { FC, useEffect } from 'react';

import Button from '../../../../../../components/Button';
import { useAuction } from '../../../../../../contexts/auction';
import {
  useFraktion,
  VaultData,
  VaultState,
} from '../../../../../../contexts/fraktion';
import { getButtonText } from './helpers';
import styles from './styles.module.scss';

interface RedeemNFTsProps {
  vaultData: VaultData;
  className?: string;
}

export const RedeemNFTs: FC<RedeemNFTsProps> = ({ vaultData, className }) => {
  const { isPolling, startPolling, stopPolling } = useFraktion();
  const { unlockVaultAndRedeemNfts } = useAuction();

  const { safetyBoxes, tokenTypeCount } = vaultData;

  const isVaultLocked =
    vaultData.realState !== VaultState.AuctionFinished &&
    vaultData.realState !== VaultState.Inactive;

  const safetyBoxToRedeem = safetyBoxes.find(
    ({ order }) => order === tokenTypeCount - 1,
  );

  const vaultImg = safetyBoxToRedeem?.nftImage;

  const redeemNFTValueHandler = () => {
    unlockVaultAndRedeemNfts({ vaultInfo: vaultData });
  };

  useEffect(() => {
    isPolling && stopPolling();
    return () => {
      !isPolling && startPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames(styles.redeemBlock, className)}>
      <div
        className={styles.redeemImg}
        style={{ backgroundImage: `url(${vaultImg})` }}
      />
      <div className={styles.redeemRight}>
        <Button
          className={styles.redeemBtn}
          onClick={redeemNFTValueHandler}
          type="alternative"
        >
          {getButtonText(tokenTypeCount, isVaultLocked)}
        </Button>
        {isVaultLocked && (
          <p className={styles.redeemNotice}>
            *First Transaction includes 2% fee
          </p>
        )}
      </div>
    </div>
  );
};
