/* eslint-disable @typescript-eslint/ban-ts-comment */

import { TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';

import config from '../../../program_config/config.json';
import api from '../../../utils/loans/axios';
import { wrapAsyncWithTryCatch } from '../../../utils';
import {
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../utils/transactions';
import { LoanProps } from '../../../utils/loans';

export interface GetBackLoanTransactionParams {
  loan: LoanProps;
}

export interface GetBackLoanTransactionRawParams
  extends GetBackLoanTransactionParams,
    WalletAndConnection {}

const rawGetLoanBack = async ({
  wallet,
  connection,
  loan,
}: GetBackLoanTransactionRawParams): Promise<void> => {
  const { order, nft, nft_address } = loan;
  // @ts-ignore
  const provider = new Provider(connection, wallet, 'processed');
  const programId = new PublicKey(config.metadata.address);
  // @ts-ignore
  const program = new Program(config, programId, provider);

  const [voteAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('vote_account')],
    program.programId,
  );

  try {
    const tx = await program.rpc.paybackOrder({
      accounts: {
        order: new PublicKey(order),
        voteAccount: voteAccount,
        user: wallet.publicKey,
        nftAccount: new PublicKey(nft),
        nftMint: new PublicKey(nft_address),
        tokenProgram: SPL_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      signers: [],
    });

    await api.post(`/services/api/close_loan`, {
      id: loan.id,
      close_tx: tx,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawGetLoanBack, {
  onSuccessMessage: {
    message: 'Getback loan successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const getLoanBack = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
