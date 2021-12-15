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

const modalPosition = {
  top: '100%',
  right: 0,
  paddingTop: 16,
  paddingBottom: 16,
  paddingRight: 16,
  paddingLeft: 16,
  margin: 0,
  marginLeft: 'auto',
  maxWidth: '100%',
  maxHeight: '100%',
  transform: 'translateY(-100%)',
};

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
        onCancel={onCancel}
      />
    ),
    fail: () => <FailContent />,
  };

  return (
    <Modal
      visible={visible}
      style={modalPosition}
      closable={state !== 'loading'}
      maskClosable={state !== 'loading'}
      onCancel={onCancel}
      width={560}
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
      <span className={styles.infoTitle}>Please approve all transactions</span>
      <span className={styles.infoSubtitle}>
        In order to transfer the NFT/s approval is needed.
      </span>
    </div>
  );
};

const SuccessContent = ({
  fractionsMintAddress,
  tickerName,
  onCancel,
}: {
  fractionsMintAddress?: string;
  tickerName: string;
  onCancel: () => void;
}): JSX.Element => {
  const { createFraktionsMarket } = useFraktion();

  const onClipboardIconClick = () => copyToClipboard(fractionsMintAddress);
  const onCreateMarketButtonClick = () => {
    createFraktionsMarket(fractionsMintAddress, tickerName);
    onCancel();
  };

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
            onClick={onCreateMarketButtonClick}
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
