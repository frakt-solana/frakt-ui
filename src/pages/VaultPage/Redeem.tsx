import BN from 'bn.js';
import { useState } from 'react';

import Button from '../../components/Button';
import TokenField from '../../components/TokenField';
import { VaultData } from '../../contexts/fraktion/fraktion.model';
import { useWallet } from '../../external/contexts/Wallet';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { useUserTokens } from '../../contexts/userTokens';
import { Loader } from '../../components/Loader';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import TransactionModal from '../../components/TransactionModal';

const { SOL_TOKEN_PUBKEY } = fraktionConfig;

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

const useRedeemTransactionModal = () => {
  const { refetch: refetchTokens } = useUserTokens();
  const { redeem } = useFraktion();
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
      const res = await redeem(vaultData);

      if (res) {
        setState('success');
        refetchTokens();
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

export const Redeem = ({
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
  } = useRedeemTransactionModal();
  const { loading, rawUserTokensByMint } = useUserTokens();
  const { connected, openSelectModal } = useWallet();
  const currency =
    vaultInfo?.priceTokenMint === SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount = usetFractions?.amountBN || new BN(0);
  const userRedeemValue =
    userFractionsAmount.mul(vaultInfo.lockedPricePerFraction).toNumber() / 1e9;

  const onTransactionModalCancel = () => {
    closeTxnModal();
    setTxnModalState('loading');
  };

  return (
    <div className={styles.redeem}>
      <h5 className={styles.redeem__title}>
        {!connected && 'Have this fraktions? Connect your wallet to redeem'}
        {!!userRedeemValue && !loading && "You're available to redeem"}
        {connected &&
          !loading &&
          !userRedeemValue &&
          "Seems like you don't have this fraktions"}
      </h5>
      <div className={styles.redeemControls}>
        {connected && !loading && !!userRedeemValue && (
          <>
            <TokenField
              className={styles.redeem__tokenField}
              value={userRedeemValue.toFixed(2)}
              onValueChange={() => {}}
              currentToken={
                currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
              }
            />
            <Button
              className={styles.redeem__redeemBtn}
              type="alternative"
              onClick={() => openTxnModal(vaultInfo)}
            >
              Redeem
            </Button>
          </>
        )}
        {connected && loading && (
          <div className={styles.redeem__loader}>
            <Loader />
          </div>
        )}
        {!connected && (
          <Button
            onClick={openSelectModal}
            className={styles.redeem__connectWalletBtn}
          >
            Connect wallet
          </Button>
        )}
      </div>
      <TransactionModal
        visible={txnModalVisible}
        onCancel={onTransactionModalCancel}
        onRetryClick={retryTxn}
        state={txnModalState}
        onSuccessMessage="You have successfully made a redeem"
      />
    </div>
  );
};
