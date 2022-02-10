import { FC } from 'react';
import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../../components/TokenField';
import styles from './styles.module.scss';
import Button from '../../../../../components/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { VaultData } from '../../../../../contexts/fraktion';
import { decimalBNToString } from '../../../../../utils';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useAuction } from '../../../../../contexts/auction';
import { isEmpty } from 'lodash';

interface PendingAuctionProps {
  vaultInfo: VaultData;
}

export const ActiveAuction: FC<PendingAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { connected } = useWallet();
  const { startFraktionalizerAuction } = useAuction();
  const isAuctionInitialized = !isEmpty(vaultInfo.auction?.auction);
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const startBid = vaultInfo.lockedPricePerShare
    .mul(vaultInfo.fractionsSupply)
    .toNumber();

  const onStartAuctionClick = () => {
    startFraktionalizerAuction({
      vaultInfo,
      price: startBid,
      isAuctionInitialized,
    });
  };

  return (
    <div>
      <div className={styles.buyoutControls}>
        <TokenField
          disabled
          currentToken={TOKEN_FIELD_CURRENCY[currency]}
          className={styles.buyout__tokenField}
          value={decimalBNToString(
            vaultInfo.lockedPricePerShare.mul(vaultInfo.fractionsSupply),
            2,
            9,
          )}
          onValueChange={() => {}}
        />

        {connected && (
          <Button
            className={styles.buyout__buyoutBtn}
            type="alternative"
            onClick={onStartAuctionClick}
          >
            Place bid
          </Button>
        )}
        {!connected && (
          <Button
            onClick={() => setWalletModalVisibility(true)}
            className={styles.buyout__connectWalletBtn}
          >
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
};
