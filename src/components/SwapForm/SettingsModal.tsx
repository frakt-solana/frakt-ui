import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';

interface SettingsModalProps {
  visible: boolean;
  onCancel: () => void;
  slippage: string;
  setSlippage: (nextSlippage: string) => void;
}

export const SettingsModal = ({
  visible,
  onCancel,
  slippage,
  setSlippage,
}: SettingsModalProps): JSX.Element => {
  const [invalidSlippageError, setInvalidSlippageError] = useState<string>('');
  const [mayFailError, setMayFailError] = useState<string>('');

  useEffect(() => {
    if (
      isNaN(Number(slippage)) ||
      Number(slippage) <= 0 ||
      Number(slippage) > 100
    ) {
      setInvalidSlippageError('Please enter a valid slippage percentage');
    } else {
      setInvalidSlippageError('');
    }
  }, [slippage]);

  useEffect(() => {
    if (Number(slippage) < 1) {
      setMayFailError('Your transaction may fail');
    } else {
      setMayFailError('');
    }
  }, [slippage]);

  return (
    <Modal
      visible={visible}
      centered
      onCancel={() => {
        if (invalidSlippageError) {
          setSlippage('0.5');
        }
        onCancel();
      }}
      width={640}
      title="Settings"
    >
      <div className={styles.settingsModal}>
        <h5 className={styles.settingsModal__title}>Slippage tolerance</h5>
        <div className={styles.settingsModal__slippage}>
          <div className={styles.settingsModal__slippageInputs}>
            <button
              className={classNames([
                styles.settingsModal__btn,
                { [styles.settingsModal__btn_active]: slippage === '0.1' },
              ])}
              onClick={() => setSlippage('0.1')}
            >
              0.1%
            </button>
            <button
              className={classNames([
                styles.settingsModal__btn,
                { [styles.settingsModal__btn_active]: slippage === '0.5' },
              ])}
              onClick={() => setSlippage('0.5')}
            >
              0.5%
            </button>
            <button
              className={classNames([
                styles.settingsModal__btn,
                { [styles.settingsModal__btn_active]: slippage === '1' },
              ])}
              onClick={() => setSlippage('1')}
            >
              1%
            </button>
            <div className={styles.settingsModal__inputWrapper}>
              <NumericInput
                className={styles.settingsModal__input}
                value={slippage}
                onChange={setSlippage}
                error={!!invalidSlippageError}
                positiveOnly
              />
            </div>
          </div>
          {(mayFailError || invalidSlippageError) && (
            <div className={styles.settingsModal__slippageErrors}>
              {mayFailError && <p>{mayFailError}</p>}
              {invalidSlippageError && <p>{invalidSlippageError}</p>}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
