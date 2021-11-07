import { useState } from 'react';
import { useHistory } from 'react-router';

import Button from '../../components/Button';
import TokenField from '../../components/TokenField';
import { VaultData } from '../../contexts/fraktion/fraktion.model';
import { useWallet } from '../../external/contexts/wallet';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { decimalBNToString } from '../../utils';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import BuyoutTransactionModal from '../../components/BuyoutTransactionModal';
import { useUserTokens } from '../../contexts/userTokens';
import { URLS } from '../../constants';
import { Loader } from '../../components/Loader';

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

const useBuyoutTransactionModal = () => {
  const { refetch: refetchTokens, rawUserTokensByMint } = useUserTokens();
  const history = useHistory();
  const { buyout, refetch: refetchVaults } = useFraktion();
  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<'loading' | 'success' | 'fail'>('loading');
  const [lastVaultData, setLastVaultData] = useState<VaultData>(null);

  const open = (vaultData: VaultData) => {
    setVisible(true);
    runTransaction(vaultData);
  };

  const runTransaction = async (vaultData: VaultData) => {
    try {
      setLastVaultData(vaultData);
      const res = await buyout(vaultData, rawUserTokensByMint);

      if (res) {
        setState('success');
        refetchTokens();
        refetchVaults();
        history.push(URLS.VAULTS);
      } else {
        setState('fail');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setState('fail');
    }
  };

  const retry = async () => {
    setState('loading');
    await runTransaction(lastVaultData);
  };

  const close = () => {
    setLastVaultData(null);
    setVisible(false);
  };

  return {
    visible,
    open,
    close,
    state,
    setState,
    retry,
  };
};

export const Buyout = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const {
    visible: txnModalVisible,
    open: openTxnModal,
    close: closeTxnModal,
    state: txnModalState,
    setState: setTxnModalState,
    retry: retryTxn,
  } = useBuyoutTransactionModal();
  const { loading: userTokensLoading } = useUserTokens();

  const { connected, select } = useWallet();
  const currency =
    vaultInfo?.priceTokenMint === fraktionConfig.SOL_TOKEN_PUBKEY
      ? 'SOL'
      : 'FRKT';

  const onTransactionModalCancel = () => {
    closeTxnModal();
    setTxnModalState('loading');
  };

  return (
    <div className={styles.buyout}>
      <h5 className={styles.buyout__title}>{!userTokensLoading && 'Buyout'}</h5>
      <div className={styles.buyoutControls}>
        {userTokensLoading && (
          <div className={styles.buyout__loader}>
            <Loader />
          </div>
        )}

        {!userTokensLoading && (
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
        )}

        {connected && !userTokensLoading && (
          <Button
            className={styles.buyout__buyoutBtn}
            type="alternative"
            onClick={() => openTxnModal(vaultInfo)}
          >
            Buyout
          </Button>
        )}

        {!connected && (
          <Button className={styles.buyout__connectWalletBtn} onClick={select}>
            Connect wallet to make buyout
          </Button>
        )}
      </div>
      <BuyoutTransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        onRetryClick={retryTxn}
        state={txnModalState}
      />
    </div>
  );
};
