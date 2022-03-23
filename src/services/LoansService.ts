/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable prefer-const */

import config from '../program_config/idl.json';
import { v4 as uuidv4 } from 'uuid';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import api from './axios';
import { Idl, Program, Provider, web3 } from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { WalletAndConnection } from '../utils/transactions';
import axios from 'axios';
import { WalletContextState } from '@solana/wallet-adapter-react';

const REACT_APP_SOLANA_RPC =
  'https://wild-red-morning.solana-mainnet.quiknode.pro/e48180a05f9f7ab63b6d9f0609f0ba675854e471/';

class LoanService {
  getPdaAddress = async (program: Program<Idl>) => {
    let voteAccount, voteAccountBump;

    [voteAccount, voteAccountBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('vote_account')],
      program.programId,
    );

    return voteAccount;
  };

  fetchLoans = async (): Promise<any> => {
    const response = await api.post(`/services/api/get_loans`);

    if (response.status === 200) {
      const { data } = response;

      const loansFetched = data.loans.map(async (loan) => {
        try {
          const nftData = await axios.get(loan.nft_uri);

          return {
            ...loan,
            nftData: nftData.data || null,
          };
        } catch (error) {
          return loan;
        }
      });
      return loansFetched;
    }
  };

  getBalance = async ({
    wallet,
    connection,
  }: WalletAndConnection): Promise<number> => {
    const provider = new Provider(connection, wallet, null);
    const programId = new web3.PublicKey(config.metadata.address);
    // @ts-ignore
    const program = new Program(config, programId, provider);

    const voteAccount = await this.getPdaAddress(program);
    const pdaAddress = voteAccount.toBase58();

    try {
      const response = await fetch(REACT_APP_SOLANA_RPC, {
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
      console.log(error);
    }
  };

  getEstimateByMint = async (mint: PublicKey): Promise<any> => {
    try {
      const estimate = await api.post(`/services/api/estimate`, {
        mint: mint.toBase58(),
      });

      return estimate;
    } catch (error) {
      console.log(error);
    }
  };

  getTokenAccountsByOwner = async (wallet, nft: PublicKey): Promise<any> => {
    const response = await fetch(REACT_APP_SOLANA_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'getTokenAccountsByOwner',
        params: [
          wallet?.publicKey.toBase58(),
          { mint: '5DLs1T97M5KBtGeQVRMbw63HAPb5uAWB7E7yb6MM4day' },
          { encoding: 'jsonParsed' },
        ],
      }),
    });

    const data = await response.json();
    return data;
  };

  go = async ({ wallet, connection, nft }): Promise<any> => {
    const provider = new Provider(connection, wallet, null);
    const programId = new web3.PublicKey(config.metadata.address);
    // @ts-ignore
    const program = new Program(config, programId, provider);

    const response = await this.getEstimateByMint(nft);
    const data = await this.getTokenAccountsByOwner(wallet?.publicKey, nft);
    console.log(data);

    if (data && data.result && data.result.value) {
      console.log('here');
      const response = await api.post('/services/api/store_preloan', {
        nft: nft.toBase58(),
        nft_mint: data.result.value[0].pubkey,
      });

      console.log(response);

      if (response.data.preloan && response.data.preloan.order) {
        const [voteAccount, voteAccountBump] =
          await web3.PublicKey.findProgramAddress(
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

          await api.post(`/services/api/store_loan`, {
            id: response.data.preloan.id,
            init_tx: init_order_tx,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  getBack = async ({ loan, connection, wallet }) => {
    const provider = new Provider(connection, wallet, null);
    const programId = new web3.PublicKey(config.metadata.address);
    // @ts-ignore
    const program = new Program(config, programId, provider);

    const g_order = new PublicKey(loan.order);
    const g_nft = new PublicKey(loan.nft);
    const g_nft_mint = new PublicKey(loan.nft_address);

    const [escrowedTokensOfOfferMaker, escrowedTokensOfOfferMakerBump] =
      await PublicKey.findProgramAddress(
        [g_order.toBuffer()],
        program.programId,
      );

    const [voteAccount, voteAccountBump] =
      await web3.PublicKey.findProgramAddress(
        [Buffer.from('vote_account')],
        program.programId,
      );

    const tokenProgramID = spl.TOKEN_PROGRAM_ID;
    const mintToken = new spl.Token(
      connection,
      g_nft,
      spl.TOKEN_PROGRAM_ID,
      wallet.payer,
    );

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
        signers: [wallet.payer],
      });

      const response = await api.post(`/services/api/close_loan`, {
        id: loan.id,
        close_tx: tx,
      });

      if (response.status === 200) {
        // props.newTx(tx);
        // props.closed(Date.now());
        this.fetchLoans();
      }
    } catch (e) {
      console.log(e);
    }
  };

  getNftEstimation = async () => {
    const response = await api.get(`/services/api/collections`);
    if (response.status === 200) {
      return response.data;
    }
  };

  login = async ({ wallet }: { wallet: WalletContextState }): Promise<any> => {
    try {
      const message = `Sign this to verify your wallet
      ${uuidv4()}-${uuidv4()}-${uuidv4()}-${uuidv4()}`;
      const encodedMessage = new TextEncoder().encode(message);
      // @ts-ignore
      const signedMessage = await window.solana.signMessage(
        encodedMessage,
        'utf8',
      );

      let formData = new FormData();
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
      console.log(e);
    }
  };
}

export default new LoanService();
