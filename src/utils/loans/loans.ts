/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Idl, Program, Provider, web3 } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import {
  AvailableCollectionsProps,
  CreateLoanProps,
  GetBackProps,
  LoanProps,
  LoanWithNftData,
} from './loans.model';
import { SOLANA_RPC } from './loans.constants';
import { WalletAndConnection } from '../transactions';
import config from '../../program_config/config.json';
import api from './axios';

const getPdaAddress = async (program: Program<Idl>): Promise<PublicKey> => {
  const [voteAccount] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vote_account')],
    program.programId,
  );

  return voteAccount;
};

const getEstimateByMint = async (mint: string): Promise<unknown> => {
  try {
    const estimate = await api.post(`/services/api/estimate`, {
      mint,
    });

    return estimate;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const fetchCollectionsData = async (): Promise<
  AvailableCollectionsProps[]
> => {
  try {
    const response = await api.get(`/services/api/collections`);

    if (response) {
      return response.data?.collections || [];
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getBalance = async ({
  wallet,
  connection,
}: WalletAndConnection): Promise<number> => {
  const provider = new Provider(connection, wallet, null);
  const programId = new web3.PublicKey(config.metadata.address);
  // @ts-ignore
  const program = new Program(config, programId, provider);

  const voteAccount = await getPdaAddress(program);
  const pdaAddress = voteAccount.toBase58();

  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: uuidv4(),
        jsonrpc: '2.0',
        params: [pdaAddress],
        method: 'getBalance',
      }),
    });

    const data = await response.json();

    if (data?.result) {
      return data.result.value / LAMPORTS_PER_SOL;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

const getTokenAccountsByOwner = async (
  wallet: WalletContextState,
  mint: string,
): Promise<any> => {
  const response = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: uuidv4(),
      method: 'getTokenAccountsByOwner',
      params: [
        wallet?.publicKey?.toBase58(),
        { mint: mint },
        { encoding: 'jsonParsed' },
      ],
    }),
  });

  const data = await response.json();
  return data;
};

export const fetchLoans = async (): Promise<LoanWithNftData[]> => {
  const response = await api.post(`/services/api/get_loans`);

  const { data } = response;

  return await Promise.all(
    data.loans.map(async (loan: LoanProps) => {
      try {
        const nftData = await axios.get(loan.nft_uri);
        const { data } = nftData;

        return {
          ...loan,
          nftData: data || null,
        };
      } catch (error) {
        return loan;
      }
    }),
  );
};

export const createLoan = async ({
  wallet,
  connection,
  nft,
}: CreateLoanProps): Promise<any> => {
  // @ts-ignore
  const provider = new Provider(connection, wallet, 'processed');
  const programId = new web3.PublicKey(config.metadata.address);
  // @ts-ignore
  const program = new Program(config, programId, provider);

  await getEstimateByMint(nft.mint);
  const data = await getTokenAccountsByOwner(wallet, nft.mint);

  if (data && data.result && data.result.value) {
    const response = await api.post('/services/api/store_preloan', {
      nft: nft.mint,
      nft_mint: data.result.value[0]?.pubkey,
    });

    if (response.data.preloan && response.data.preloan.order) {
      const [voteAccount] = await web3.PublicKey.findProgramAddress(
        [Buffer.from('vote_account')],
        program.programId,
      );

      const tokenProgramID = spl.TOKEN_PROGRAM_ID;

      try {
        const init_order_tx = await program.rpc.initiateOrder({
          accounts: {
            order: response.data.preloan.order,
            voteAccount: voteAccount,
            user: wallet.publicKey,
            nftAccount: new web3.PublicKey(response.data.preloan.nft),
            nftMint: nft.mint,
            tokenProgram: tokenProgramID,
            systemProgram: web3.SystemProgram.programId,
          },
        });

        const loan = api.post(`/services/api/store_loan`, {
          id: response.data.preloan.id,
          init_tx: init_order_tx,
        });
        return loan;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }
};

export const getBack = async ({
  loan,
  connection,
  wallet,
}: GetBackProps): Promise<void> => {
  // @ts-ignore
  const provider = new Provider(connection, wallet, 'processed');
  const programId = new web3.PublicKey(config.metadata.address);
  // @ts-ignore
  const program = new Program(config, programId, provider);

  const g_order = new PublicKey(loan.order);
  const g_nft = new PublicKey(loan.nft);
  const g_nft_mint = new PublicKey(loan.nft_address);

  const [voteAccount] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vote_account')],
    program.programId,
  );

  const tokenProgramID = spl.TOKEN_PROGRAM_ID;

  try {
    const tx = await program.rpc.paybackOrder({
      accounts: {
        order: g_order,
        voteAccount: voteAccount,
        user: wallet.publicKey,
        nftAccount: g_nft,
        nftMint: g_nft_mint,
        tokenProgram: tokenProgramID,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [],
    });

    const response = await api.post(`/services/api/close_loan`, {
      id: loan.id,
      close_tx: tx,
    });

    if (response.status === 200) {
      fetchLoans();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

export const login = async (wallet: WalletContextState): Promise<void> => {
  try {
    const message = `Sign this to verify your wallet
      ${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}`;
    const encodedMessage = new TextEncoder().encode(message);
    // @ts-ignore
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      'utf8',
    );

    const formData = new FormData();
    formData.append('file', new Blob(signedMessage.signature));

    const { data } = await api.post(`/services/api/login`, {
      publicKey: signedMessage?.publicKey.toBase58(),
      message: message,
      wallet: Array.from(signedMessage.publicKey.toBytes()),
      signature: Array.from(signedMessage.signature),
    });

    if (data.token) {
      localStorage.setItem(
        'wallet',
        JSON.stringify({
          wallet: wallet?.publicKey?.toBase58(),
          accessToken: data.token,
        }),
      );
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
