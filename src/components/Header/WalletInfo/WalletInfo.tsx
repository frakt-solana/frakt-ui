import Button from '../../Button';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../../external/contexts/accounts';
import { getFrktBalanceValue, getSolBalanceValue } from '../../../utils';
import { useFrktBalance } from '../../../contexts/frktBalance';
import { useWallet } from '../../../external/contexts/wallet';

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
