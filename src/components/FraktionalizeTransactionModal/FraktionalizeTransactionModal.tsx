import Button from '../Button';
import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './styles.module.scss';
import { useFraktion } from '../../contexts/fraktion';
import Tooltip from '../Tooltip';
import { CopyClipboardIcon } from '../../icons';
import { copyToClipboard } from '../../utils';

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
}: FraktionalizeTransactionModalProps): JSX.Element => {
  const contentMap = {
    loading: () => <LoadingContent />,
    success: () => (
      <SuccessContent
        fractionsMintAddress={fractionsMintAddress}
        tickerName={tickerName}
      />
    ),
    fail: () => <FailContent />,
  };

  return (
    <Modal
      visible={visible}
      centered
      closable={state !== 'loading'}
      onCancel={onCancel}
      width={640}
    >
      {contentMap[state]()}
    </Modal>
  );
};

export default FraktionalizeTransactionModal;

const LoadingContent = (): JSX.Element => {
  return (
    <div className={styles.loadingContent}>
      <Loader size="large" />
      Please approve all transactions
    </div>
  );
};

const SuccessContent = ({
  fractionsMintAddress,
  tickerName,
}: {
  fractionsMintAddress?: string;
  tickerName: string;
}): JSX.Element => {
  const { createFraktionsMarket } = useFraktion();

  const onClipboardIconClick = () => copyToClipboard(fractionsMintAddress);

  return (
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
          <b onClick={onClipboardIconClick} className={styles.fractionsMint}>
            {fractionsMintAddress}
            <Tooltip
              placement="bottom"
              trigger="hover"
              overlay="Click to copy to clipboard"
            >
              <CopyClipboardIcon className={styles.copyIcon} width={24} />
            </Tooltip>
          </b>
          <p className={styles.successContent__subtitle}>
            If you want fraktions to be tradable you need to create market
          </p>
          <Button
            type="alternative"
            className={styles.successContent__createMarketBtn}
            onClick={() =>
              createFraktionsMarket(fractionsMintAddress, tickerName)
            }
          >
            Create Market
          </Button>
        </div>
      )}
    </div>
  );
};

const FailContent = (): JSX.Element => {
  return (
    <div className={styles.failContent}>
      <h2 className={styles.failContent__title}>Ooops! Something went wrong</h2>
      <p className={styles.failContent__subtitle}>Please try again</p>
    </div>
  );
};
