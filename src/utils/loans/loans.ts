/* eslint-disable @typescript-eslint/ban-ts-comment */
import { WalletContextState } from '@solana/wallet-adapter-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import {
  AvailableCollectionsProps,
  LoanProps,
  LoanWithNftData,
} from './loans.model';
import api from './axios';

export const getEstimateByMint = async (mint: string): Promise<unknown> => {
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

export const login = async (wallet: WalletContextState): Promise<boolean> => {
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
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
