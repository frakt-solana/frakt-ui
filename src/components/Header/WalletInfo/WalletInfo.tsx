import Button from '../../Button';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../../external/contexts/accounts';
import { getFrktBalanceValue, getSolBalanceValue } from '../../../utils';
import { useWallet } from '../../../external/contexts/wallet';
import { useFrktBalance } from '../../../contexts/userTokens';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../../constants';

export const WalletInfo = (): JSX.Element => {
  const { account } = useNativeAccount();
  const { balance } = useFrktBalance();
  const { disconnect, publicKey } = useWallet();
  return (
    <div className={styles.walletInfo}>
      <div>{getSolBalanceValue(account)} SOL</div>
      <div>{getFrktBalanceValue(balance)} FRKT</div>

      <NavLink to={`${URLS.WALLET}/${publicKey}`}>My Collection</NavLink>
      <Button type="secondary" className={styles.btn} onClick={disconnect}>
        Disconnect wallet
      </Button>
    </div>
  );
};

export default WalletInfo;
