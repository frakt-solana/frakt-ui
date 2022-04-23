/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LoanView } from '@frakters/nft-lending-v2/lib/accounts';
import { paybackLoan } from '@frakters/nft-lending-v2';
import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { LOANS_PROGRAM_PUBKEY } from '../loans.constants';

export interface GetBackLoanTransactionParams {
  loan: LoanView;
}

export interface GetBackLoanTransactionRawParams
  extends GetBackLoanTransactionParams,
    WalletAndConnection {}

const rawGetLoanBack = async ({
  wallet,
  connection,
  loan,
}: GetBackLoanTransactionRawParams): Promise<void> => {
  const options = Provider.defaultOptions();
  const provider = new Provider(connection, wallet, options);

  await paybackLoan({
    programId: new PublicKey(LOANS_PROGRAM_PUBKEY),
    //@ts-ignore
    provider,
    user: wallet.publicKey,
    admin: new PublicKey(''),
    storeNftTokenAccount: new PublicKey(loan.nftTokenAccount),
    wsolUserTokenAccount: new PublicKey(''),
    wsolAdminTokenAccount: new PublicKey(''),
    loan: new PublicKey(loan.loanPubkey),
    nftMint: new PublicKey(loan.nftMint),
    liquidityPool: new PublicKey(loan.liquidityPool),
    wsolMint: new PublicKey(''),
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawGetLoanBack, {
  onSuccessMessage: {
    message: 'Loan repaid successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const getLoanBack = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
