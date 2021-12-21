import { FC } from 'react';
import TokenField from '../../../../../components/TokenField';
import styles from './styles.module.scss';
import Button from '../../../../../components/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { VaultData } from '../../../../../contexts/fraktion';
import { decimalBNToString } from '../../../../../utils';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useAuction } from '../../../../../contexts/auction';
import { isEmpty } from 'lodash';

const MOCK_TOKEN_LIST = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
    data: 'Some value 1',
  },
  {
    mint: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
    symbol: 'FRKT',
    img: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
    data: 'Some value 1',
  },
];

interface PendingAuctionProps {
  vaultInfo: VaultData;
}

export const PendingAuction: FC<PendingAuctionProps> = ({ vaultInfo }) => {
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
    startFraktionalizerAuction(vaultInfo, startBid, isAuctionInitialized);
  };

  return (
    <div>
      <div className={styles.buyoutControls}>
        <TokenField
          disabled
          currentToken={
            currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
          }
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
