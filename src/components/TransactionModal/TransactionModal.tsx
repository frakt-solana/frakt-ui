import Button from '../Button';
import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './styles.module.scss';

interface TransactionModalProps {
  state?: 'loading' | 'success' | 'fail';
  visible: boolean;
  onCancel: () => void;
  onRetryClick?: () => void;
  onSuccessMessage?: string;
}

const TransactionModal = ({
  visible,
  state = 'loading',
  onCancel,
  onRetryClick = () => {},
  onSuccessMessage = 'Transaction was successful',
}: TransactionModalProps): JSX.Element => {
  const loadingContent = (
    <div className={styles.loadingContent}>
      <Loader size="large" />
      Please approve all transactions
    </div>
  );

  const successContent = (
    <div className={styles.successContent}>
      <h2 className={styles.successContent__title}>Congratulations!</h2>
      <p className={styles.successContent__subtitle}>{onSuccessMessage}</p>
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

export default TransactionModal;
