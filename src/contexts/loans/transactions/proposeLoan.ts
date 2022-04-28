import { PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { proposeLoan as txn } from '@frakters/nft-lending-v2';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { UserNFT } from '../../userTokens';
import { LOANS_PROGRAM_PUBKEY } from '../loans.constants';

export interface ProposeLoanTransactionParams {
  nft: UserNFT;
}

export interface ProposeLoanTransactionRawParams
  extends ProposeLoanTransactionParams,
    WalletAndConnection {}

const rawProposeLoan = async ({
  wallet,
  connection,
  nft,
}: ProposeLoanTransactionRawParams): Promise<PublicKey> => {
  const options = Provider.defaultOptions();
  const provider = new Provider(connection, wallet, options);

  const response = await txn({
    programId: new PublicKey(LOANS_PROGRAM_PUBKEY),
    provider,
    user: wallet.publicKey,
    nftMint: new PublicKey(nft.mint),
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        wallet,
      });
    },
  });

  return response;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawProposeLoan, {
  onSuccessMessage: {
    message: 'Loan created  successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const proposeLoan = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
