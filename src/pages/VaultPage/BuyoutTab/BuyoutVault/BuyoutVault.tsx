import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '../../../../components/Button';
import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../components/TokenField';
import { VaultData, useFraktion } from '../../../../contexts/fraktion';
import fraktionConfig from '../../../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { decimalBNToString } from '../../../../utils';
import TransactionModal from '../../../../components/TransactionModal';
import { useUserTokens } from '../../../../contexts/userTokens';
import { Loader } from '../../../../components/Loader';
import BN from 'bn.js';
import { useWalletModal } from '../../../../contexts/WalletModal';

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
        patchVault({ ...vaultData, state: 2 });
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

export const BuyoutVault = ({
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
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount: BN = usetFractions?.amountBN || new BN(0);

  const fee: BN = vaultInfo.lockedPricePerShare
    .mul(vaultInfo.fractionsSupply)
    .div(new BN(50));

  const buyoutPrice = decimalBNToString(
    vaultInfo.lockedPricePerShare
      .mul(
        userFractionsAmount.toNumber()
          ? vaultInfo.fractionsSupply.sub(userFractionsAmount)
          : vaultInfo.fractionsSupply,
      )
      .add(fee),
    2,
    9,
  );

  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

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
            currentToken={TOKEN_FIELD_CURRENCY[currency]}
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
