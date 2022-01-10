import { useWallet } from '@solana/wallet-adapter-react';
import Button from '../../../components/Button';
import { URLS } from '../../../constants';

import { useFraktion, VaultData } from '../../../contexts/fraktion';
import styles from './styles.module.scss';
import Trade from '../Trade';

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
  const { connected } = useWallet();
  const { createMarket } = useFraktion();

  return vaultMarketAddress ? (
    <div className={styles.tradeWrapper}>
      <Trade marketAddress={vaultMarketAddress} />
      <p className={styles.tradeLink}>
        <a
          href={`${URLS.DEX}/#/market/${vaultMarketAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Trade on DEX
        </a>
      </p>
    </div>
  ) : (
    <div className={styles.noMarket}>
      <p>{"Looks like this vault doesn't have a Serum market"}</p>
      {connected && !!tokerName && (
        <>
          <Button
            type="alternative"
            className={styles.createMarketBtn}
            onClick={() => createMarket(vaultInfo.fractionMint, tokerName)}
          >
            Create market
          </Button>
          <p className={styles.warnText}>
            *Serum market creation can cost up to 5 SOL.
          </p>
        </>
      )}
    </div>
  );
};
