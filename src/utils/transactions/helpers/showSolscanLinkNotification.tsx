import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const showSolscanLinkNotification = (error: any): boolean => {
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

    return true;
  }

  return false;
};
