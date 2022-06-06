import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';
import { showSolscanLinkNotification } from './showSolscanLinkNotification';

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
      const isNotConfirmed = showSolscanLinkNotification(error);

      if (!isNotConfirmed) {
        onErrorMessage &&
          notify({
            message: onErrorMessage?.message,
            description: onErrorMessage?.description,
            type: NotifyType.ERROR,
          });
      }

      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      onFinishMessage &&
        notify({
          message: onFinishMessage?.message,
          description: onFinishMessage?.description,
          type: NotifyType.INFO,
        });
    }
  };
