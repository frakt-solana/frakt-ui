import Button from '../Button';
import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './styles.module.scss';
import { useFraktion } from '../../contexts/fraktion';

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
  const { createFraktionsMarket } = useFraktion();

  const loadingContent = (
    <div className={styles.loadingContent}>
      <Loader size="large" />
      Please approve all transactions
    </div>
  );

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
      <button
        onClick={() => createFraktionsMarket(fractionsMintAddress, tickerName)}
      >
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
