import Button from '../../Button';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../../external/hooks';
import { getFrktBalanceValue, getSolBalanceValue } from '../../../utils';
import { useWallet } from '../../../external/contexts/Wallet';
import { useFrktBalance } from '../../../contexts/userTokens';

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
