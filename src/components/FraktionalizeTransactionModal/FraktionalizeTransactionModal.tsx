import { useState } from 'react';
import { WSOL } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';
import { MARKETS } from '@project-serum/serum';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { listMarket } from '../../utils/serumUtils/send';
import Button from '../Button';
import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './styles.module.scss';
import { registerMarket } from '../../utils/markets';
import { notify } from '../../utils';

interface FraktionalizeTransactionModalProps {
  state?: 'loading' | 'success' | 'fail';
  visible: boolean;
  tickerName: string;
  onCancel: () => void;
  fractionsMintAddress?: string;
  onRetryClick?: () => void;
}

const FraktionalizeTransactionModal = ({
  visible,
  state = 'loading',
  fractionsMintAddress = '',
  tickerName,
  onCancel,
  onRetryClick = () => {},
}: FraktionalizeTransactionModalProps): JSX.Element => {
  const [, setCreatingMarket] = useState(false);
  const [, setListedMarket] = useState('');
  const loadingContent = (
    <div className={styles.loadingContent}>
      <Loader size="large" />
      Please approve all transactions
    </div>
  );

  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId;
  const lotSize = 0.1;
  const tickSize = 0.00001;
  const baseTokenDecimals = 3; // FRAKTION DECIMALS
  const quoteTokenDecimals = 8; // SOL DECIMALS
  const baseLotSize = Math.round(10 ** baseTokenDecimals * lotSize);
  const quoteLotSize = Math.round(
    lotSize * 10 ** quoteTokenDecimals * tickSize,
  );

  const createFraktionsMarket = async (fractionsMintAddress) => {
    setCreatingMarket(true);
    try {
      const marketAddress = await listMarket({
        connection,
        walletPublicKey: publicKey,
        signAllTransactions,
        baseMint: new PublicKey(fractionsMintAddress),
        quoteMint: new PublicKey(WSOL.mint),
        baseLotSize,
        quoteLotSize,
        dexProgramId,
      });
      setListedMarket(marketAddress.toBase58());
      registerMarket(
        tickerName,
        marketAddress.toBase58(),
        fractionsMintAddress,
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      notify({
        message: 'Error listing new market',
        description: err.message,
        type: 'error',
      });
    } finally {
      setCreatingMarket(false);
    }
  };

  const successContent = (
    <div className={styles.successContent}>
      <h2 className={styles.successContent__title}>Congratulations!</h2>
      <p className={styles.successContent__subtitle}>
        Tokens of your NFT should be in your wallet!
      </p>
      {!!fractionsMintAddress && (
        <div className={styles.successContent__fractionsMintWrapper}>
          <span className={styles.successContent__fractionsMintTitle}>
            Fraktions mint address:
          </span>
          <b>{fractionsMintAddress}</b>
        </div>
      )}
      <p className={styles.successContent__subtitle}>
        If you want fraktions to be tradable you need to create market
      </p>
      <button onClick={() => createFraktionsMarket(fractionsMintAddress)}>
        Create Market
      </button>
    </div>
  );

  const failContent = (
    <div className={styles.failContent}>
      <h2 className={styles.failContent__title}>Ooops! Something went wrong</h2>
      <p className={styles.failContent__subtitle}>Please try again</p>
      <Button
        type="alternative"
        className={styles.failContent__retryBtn}
        onClick={onRetryClick}
      >
        Retry
      </Button>
    </div>
  );

  const contentMap = {
    loading: loadingContent,
    success: successContent,
    fail: failContent,
  };

  return (
    <Modal
      visible={visible}
      centered
      closable={state !== 'loading'}
      onCancel={onCancel}
      width={640}
    >
      {contentMap[state]}
    </Modal>
  );
};

export default FraktionalizeTransactionModal;
