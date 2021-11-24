import { useWallet } from '@solana/wallet-adapter-react';

import Button from '../../Button';
import { getFrktBalanceValue, getSolBalanceValue } from '../../../utils';
import { useFrktBalance } from '../../../contexts/userTokens';
import { useNativeAccount } from '../../../hooks';
import styles from './styles.module.scss';

export const WalletInfo = (): JSX.Element => {
  const { account } = useNativeAccount();
  const { balance } = useFrktBalance();
  const { disconnect } = useWallet();
  return (
    <div className={styles.walletInfo}>
      <div>{getSolBalanceValue(account)} SOL</div>
      <div>{getFrktBalanceValue(balance)} FRKT</div>

      <Button type="secondary" className={styles.btn} onClick={disconnect}>
        Disconnect wallet
      </Button>
    </div>
  );
};

export default WalletInfo;
