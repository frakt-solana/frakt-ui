import { FC } from 'react';
import BN from 'bn.js';
import { isEmpty } from 'lodash';
import { useWallet } from '@solana/wallet-adapter-react';

import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../../components/TokenField';
import styles from './styles.module.scss';
import Button from '../../../../../components/Button';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { VaultData } from '../../../../../contexts/fraktion';
import { decimalBNToString } from '../../../../../utils';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useAuction } from '../../../../../contexts/auction';
import { useUserTokens } from '../../../../../contexts/userTokens';

interface PendingAuctionProps {
  vaultInfo: VaultData;
}

export const ActiveAuction: FC<PendingAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { connected, publicKey } = useWallet();
  const { startFraktionalizerAuction, createBuyoutByOwner } = useAuction();
  const isAuctionInitialized = !isEmpty(vaultInfo.auction?.auction);
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';
  const { rawUserTokensByMint } = useUserTokens();

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

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount = (usetFractions?.amountBN as BN) || new BN(0);

  const userCanBuyoutInstantly =
    connected &&
    vaultInfo?.authority === publicKey?.toBase58() &&
    userFractionsAmount?.eq(vaultInfo?.fractionsSupply);

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
      {userCanBuyoutInstantly && (
        <Button
          type="alternative"
          onClick={() =>
            createBuyoutByOwner({
              vaultInfo,
            })
          }
          className={styles.instantBuyoutBtn}
        >
          Instant buyout
        </Button>
      )}
    </div>
  );
};
