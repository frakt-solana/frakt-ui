import { useWallet } from '@solana/wallet-adapter-react';
import Button from '../../components/Button';

import { useFraktion, VaultData } from '../../contexts/fraktion';
import styles from './styles.module.scss';
import Trade from './Trade';

const DEX_LINK = 'https://dex.fraktion.art/#/market';

interface TradeTabProps {
  vaultMarketAddress?: string;
  vaultInfo: VaultData;
  tokerName?: string;
}

export const TradeTab = ({
  vaultMarketAddress,
  vaultInfo,
  tokerName,
}: TradeTabProps): JSX.Element => {
  const { connected, publicKey: walletPublicKey } = useWallet();
  const { createFraktionsMarket } = useFraktion();

  return vaultMarketAddress ? (
    <div className={styles.tradeWrapper}>
      <Trade marketAddress={vaultMarketAddress} />
      <p className={styles.tradeLink}>
        Trade on{' '}
        <a
          href={`${DEX_LINK}/${vaultMarketAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          DEX
        </a>
      </p>
    </div>
  ) : (
    <div className={styles.noMarket}>
      <p>{"Looks like this this vault doen't have market yet"}</p>
      {connected &&
        vaultInfo.authority === walletPublicKey.toBase58() &&
        !!tokerName && (
          <Button
            type="alternative"
            className={styles.createMarketBtn}
            onClick={() =>
              createFraktionsMarket(vaultInfo.fractionMint, tokerName)
            }
          >
            Create market
          </Button>
        )}
    </div>
  );
};
