import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '../../components/Button';
import TokenField from '../../components/TokenField';
import { VaultData, VaultState, useFraktion } from '../../contexts/fraktion';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { decimalBNToString } from '../../utils';
import TransactionModal from '../../components/TransactionModal';
import { useUserTokens } from '../../contexts/userTokens';
import { Loader } from '../../components/Loader';
import BN from 'bn.js';
import { useWalletModal } from '../../contexts/WalletModal/walletModal.context';

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
  const { rawUserTokensByMint, refetch: refetchUserTokens } = useUserTokens();
  const { buyout, patchVault } = useFraktion();
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
        refetchUserTokens();
        patchVault({ ...vaultData, state: VaultState[2] });
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
  const { loading: userTokensLoading, rawUserTokensByMint } = useUserTokens();

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount: BN = usetFractions?.amountBN || new BN(0);

  const fee: BN = vaultInfo.lockedPricePerFraction
    .mul(vaultInfo.supply)
    .div(new BN(50));

  const buyoutPrice = decimalBNToString(
    vaultInfo.lockedPricePerFraction
      .mul(
        userFractionsAmount.toNumber()
          ? vaultInfo.supply.sub(userFractionsAmount)
          : vaultInfo.supply,
      )
      .add(fee),
    2,
    9,
  );

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
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
            value={buyoutPrice}
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
          <Button
            className={styles.buyout__connectWalletBtn}
            onClick={() => setVisible(true)}
          >
            Connect wallet
          </Button>
        )}
      </div>
      {!userTokensLoading && (
        <p className={styles.buyout__fee}>* 2% fee included</p>
      )}
      <TransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        onRetryClick={retryTxn}
        state={txnModalState}
        onSuccessMessage="You have successfully made a buyout"
      />
    </div>
  );
};
