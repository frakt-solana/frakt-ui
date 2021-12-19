import { FC } from 'react';
import TokenField from '../../../../../components/TokenField';
import styles from './styles.module.scss';
import Button from '../../../../../components/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';

interface PendingAuctionProps {
  startAuction: () => void;
}

export const PendingAuction: FC<PendingAuctionProps> = ({ startAuction }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { connected } = useWallet();
  return (
    <div>
      <h5 className={styles.buyoutTitle}>Start Auction</h5>
      <div className={styles.buyoutControls}>
        <TokenField
          className={styles.buyout__tokenField}
          value="2"
          onValueChange={() => {}}
        />

        {connected && (
          <Button
            className={styles.buyout__buyoutBtn}
            type="alternative"
            onClick={startAuction}
          >
            Buyout
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
