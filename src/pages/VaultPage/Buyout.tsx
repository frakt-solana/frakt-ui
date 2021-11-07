import Button from '../../components/Button';
import TokenField from '../../components/TokenField';
import { VaultData } from '../../contexts/fraktion/fraktion.model';
import { useWallet } from '../../external/contexts/wallet';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { decimalBNToString } from '../../utils';

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

export const Buyout = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const { connected, select } = useWallet();
  const currency =
    vaultInfo?.priceTokenMint === fraktionConfig.SOL_TOKEN_PUBKEY
      ? 'SOL'
      : 'FRKT';

  return (
    <div className={styles.buyout}>
      <h5 className={styles.buyout__title}>Buyout</h5>
      <div className={styles.buyoutControls}>
        <TokenField
          className={styles.buyout__tokenField}
          value={decimalBNToString(
            vaultInfo.lockedPricePerFraction.mul(vaultInfo.supply),
            2,
            9,
          )}
          onValueChange={() => {}}
          currentToken={
            currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
          }
        />
        {!connected ? (
          <Button className={styles.buyout__connectWalletBtn} onClick={select}>
            Connect wallet to make buyout
          </Button>
        ) : (
          <Button className={styles.buyout__buyoutBtn} type="alternative">
            Buyout
          </Button>
        )}
      </div>
    </div>
  );
};
