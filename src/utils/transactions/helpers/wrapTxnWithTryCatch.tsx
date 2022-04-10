import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface NotificationMessage {
  message: string;
  description?: string;
}

interface NotificationMessages {
  onSuccessMessage?: NotificationMessage;
  onErrorMessage?: NotificationMessage;
  onFinishMessage?: NotificationMessage;
}

type WrapAsyncWithTryCatch = <FuncParams, FuncReturn>(
  func: (params: FuncParams) => Promise<FuncReturn>,
  notificationMessages: NotificationMessages,
) => (funcParams: FuncParams) => Promise<FuncReturn>;

export const wrapTxnWithTryCatch: WrapAsyncWithTryCatch =
  (transactionFunc, { onSuccessMessage, onErrorMessage, onFinishMessage }) =>
  async (transactionFuncParams) => {
    try {
      const result = await transactionFunc(transactionFuncParams);

      onSuccessMessage &&
        notify({
          message: onSuccessMessage?.message,
          description: onSuccessMessage?.description,
          type: NotifyType.SUCCESS,
        });

      return result;
    } catch (error) {
      const errorMessage = error?.message || '';

      if (errorMessage?.includes('Transaction was not confirmed in')) {
        const txnSignature = errorMessage?.substring(
          errorMessage.search('Check signature ') + 16,
          errorMessage.search(' using the Solana'),
        );

        notify({
          message: 'Transaction processing problems',
          description: (
            <p>
              Unable to determine transaction result.
              <br />
              Please check{' '}
              <a
                href={`https://solscan.io/tx/${txnSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fraktion__notificationLink"
              >
                Solscan
              </a>{' '}
              for details.
            </p>
          ),
          type: NotifyType.ERROR,
        });

        // eslint-disable-next-line no-console
        console.error(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);

        onErrorMessage &&
          notify({
            message: onErrorMessage?.message,
            description: onErrorMessage?.description,
            type: NotifyType.ERROR,
          });
      }
    } finally {
      onFinishMessage &&
        notify({
          message: onFinishMessage?.message,
          description: onFinishMessage?.description,
          type: NotifyType.INFO,
        });
    }
  };
