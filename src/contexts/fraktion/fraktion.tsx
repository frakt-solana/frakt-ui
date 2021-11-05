import { Connection, PublicKey } from '@solana/web3.js';
import { createFraktionalizer } from 'fraktionalizer-client-library';
import BN from 'bn.js';

import { WalletAdapter } from '../../external/contexts/wallet';
import { CreateFraktionalizerResult } from './fraktion.model';
import fraktionConfig from './config';
import globalConfig from '../../config';
import { notify } from '../../external/utils/notifications';

const { FRAKTION_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS } = fraktionConfig;

export const fraktionalize = async (
  tokenMint: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
  wallet: WalletAdapter,
  connection: Connection,
): Promise<CreateFraktionalizerResult | null> => {
  try {
    const result = await createFraktionalizer(
      connection,
      new BN(pricePerFraction * (token === 'SOL' ? 1e9 : 1e8)), //1e9 for SOL, 1e8 for FRKT
      new BN(fractionsAmount * Math.pow(10, FRACTION_DECIMALS)), //always 1e3
      FRACTION_DECIMALS,
      new PublicKey(tokenMint),
      token === 'SOL'
        ? SOL_TOKEN_PUBKEY
        : globalConfig.FRKT_TOKEN_MINT_PUBLIC_KEY,
      wallet.publicKey,
      FRAKTION_PUBKEY,
      async (txn, signers): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = wallet.publicKey;
        txn.sign(...signers);
        const signed = await wallet.signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );

    notify({
      message: 'Fractionalized successfully',
      type: 'success',
    });

    return result;
  } catch (error) {
    notify({
      message: 'Transaction failed',
      type: 'error',
    });
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};
