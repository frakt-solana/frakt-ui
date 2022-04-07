/* eslint-disable @typescript-eslint/ban-ts-comment */

import { TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import { Spl } from '@raydium-io/raydium-sdk';

import config from '../../../program_config/config.json';
import api from '../../../utils/loans/axios';
import {
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { UserNFT } from '../../userTokens';

export interface CreateLoanTransactionParams {
  nft: UserNFT;
}

export interface CreateLoanTransactionRawParams
  extends CreateLoanTransactionParams,
    WalletAndConnection {}

const rawCreateLoan = async ({
  wallet,
  connection,
  nft,
}: CreateLoanTransactionRawParams): Promise<any> => {
  const provider = new Provider(connection, wallet, {
    commitment: 'processed',
  });
  const programId = new PublicKey(config.metadata.address);
  // @ts-ignore
  const program = new Program(config, programId, provider);

  const tokenAccount = await Spl.getAssociatedTokenAccount({
    mint: new PublicKey(nft.mint),
    owner: wallet.publicKey,
  });

  if (tokenAccount) {
    const { data }: any = await api.post('/services/api/store_preloan', {
      nft: nft.mint,
      nft_mint: tokenAccount,
    });

    if (data?.preloan?.order) {
      const [voteAccount] = await PublicKey.findProgramAddress(
        [Buffer.from('vote_account')],
        program.programId,
      );

      const init_order_tx = await program.rpc.initiateOrder({
        accounts: {
          order: data.preloan.order,
          voteAccount: voteAccount,
          user: wallet.publicKey,
          nftAccount: new PublicKey(data.preloan.nft),
          nftMint: nft.mint,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
      });

      const loan = api.post(`/services/api/store_loan`, {
        id: data.preloan.id,
        init_tx: init_order_tx,
      });

      return loan;
    }
  }
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawCreateLoan, {
  onSuccessMessage: {
    message: 'Loan created  successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const createLoan = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
