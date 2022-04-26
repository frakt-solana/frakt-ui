import { PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { LoanView } from '@frakters/nft-lending-v2/lib/accounts';
import { takeApprovedLoan as txn } from '@frakters/nft-lending-v2';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { LOANS_PROGRAM_PUBKEY } from '../loans.constants';

export interface ApprovedLoanTransactionParams {
  nft: LoanView;
}

export interface ApprovedLoanTransactionRawParams
  extends ApprovedLoanTransactionParams,
    WalletAndConnection {}

const rawApprovedLoan = async ({
  wallet,
  connection,
  nft,
}: ApprovedLoanTransactionRawParams): Promise<void> => {
  const options = Provider.defaultOptions();
  const provider = new Provider(connection, wallet, options);

  await txn({
    programId: new PublicKey(LOANS_PROGRAM_PUBKEY),
    wsolUserTokenAccount: new PublicKey(''),
    liquidityTokenAccount: new PublicKey(''),
    provider,
    liquidityPool: new PublicKey(nft.liquidityPool),
    loan: new PublicKey(nft.loanPubkey),
    user: wallet.publicKey,
    nftMint: new PublicKey(nft.nftMint),
    wsolMint: new PublicKey(''),
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawApprovedLoan, {
  onSuccessMessage: {
    message: 'Loan approved successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const approvedLoan = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
