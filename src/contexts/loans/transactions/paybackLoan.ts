import { LoanView } from '@frakters/nft-lending-v2/lib/accounts';
import { paybackLoan as txn } from '@frakters/nft-lending-v2';
import { Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { LOANS_PROGRAM_PUBKEY } from '../loans.constants';

export interface PaybackLoanTransactionParams {
  loan: LoanView;
}

export interface PaybackLoanTransactionRawParams
  extends PaybackLoanTransactionParams,
    WalletAndConnection {}

const rawPaybackLoan = async ({
  wallet,
  connection,
  loan,
}: PaybackLoanTransactionRawParams): Promise<void> => {
  const options = Provider.defaultOptions();
  const provider = new Provider(connection, wallet, options);

  await txn({
    programId: new PublicKey(LOANS_PROGRAM_PUBKEY),
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

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawPaybackLoan, {
  onSuccessMessage: {
    message: 'Loan repaid successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const paybackLoan = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
