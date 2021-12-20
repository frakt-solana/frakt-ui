import { FC } from 'react';
import styles from './styles.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { BidHistory } from '../../../../../components/BidHistory';
import { AuctionCountdown } from '../../../../../components/AuctionCountdown';
import TokenField from '../../../../../components/TokenField';
import Button from '../../../../../components/Button';

interface ActiveAuctionProps {
  finishAuction: () => void;
}

export const ActiveAuction: FC<ActiveAuctionProps> = ({ finishAuction }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { connected } = useWallet();
  return (
    <div>
      <div className={styles.title}>To the end of auction</div>
      <div className={styles.container}>
        <AuctionCountdown
          className={styles.timer}
          endTime={new Date().getTime() + 1000 * 18}
        />
      </div>
      <BidHistory />
      <h5 className={styles.label}>Make a bid</h5>
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
            onClick={finishAuction}
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
